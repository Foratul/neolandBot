let db = require("./db.js")

let usuarioDAO = {
    getAll() {
        console.log("se ha llamado a get All")
        let prom = new Promise((resolve, reject) => {
            db.query("select * from usuarios", (err, rows) => {
                resolve(rows)
                reject(err)
            }
            )
        })
        return prom
    },

    getByTelegramID(id) {
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from bot.usuarios where telegramID =?", [id], (err, rows) => {
                if (err) reject(err)
                resolve(rows)
            })
        })
        return prom
    },

    insertUsuario(objetoFrom) {
        console.log("se ha llamado a insertDAO")
        let prom = new Promise((resolve, reject) => {
            if (!objetoFrom.last_name) objetoFrom.last_name = ""
            db.query("INSERT INTO bot.usuarios values (null, ?, ?, ?, ?)", [objetoFrom.first_name + objetoFrom.last_name, objetoFrom.first_name, objetoFrom.last_name, objetoFrom.id], (err, results) => {
                resolve(results)
                reject(err)
            })
        })
        return prom
    },

    //no parece funsionar crear en una sola query, asi que en dos , lo dejo en usuarioDAO pero habria que separarlo
    crearDatabase1() {
        console.log("Creando DB")
        let prom = new Promise((resolve, reject) => {
            db.query(
                "create table if not exists usuarios (ID INT(10) primary key auto_increment, username VARCHAR(50), first_name VARCHAR(30), last_name VARCHAR(30), telegramID INT(20)); ",
                (err, res) => {
                    resolve(res)
                    reject(err)
                })
        })
        return prom
    },
    crearDatabase2() {
        console.log("Creando DB")
        let prom = new Promise((resolve, reject) => {
            db.query(
                "create table if not exists mensajes (ID INT(10) primary key auto_increment, mensaje TEXT, telegramID INT(20)); ",
                (err, res) => {
                    resolve(res)
                    reject(err)
                })
        })
        return prom
    },
    guardarMensaje(mensaje, usuario) {
        console.log("guardando mensaje" + mensaje + "de usuario: " + usuario)
        let prom = new Promise((resolve, reject) => {
            db.query("INSERT INTO bot.mensajes  values (null, ?, ?)", [mensaje, usuario], (err, result) => {
                resolve(result)
                reject(err)
            })
        })
        return prom
    },
    getMensajesByTelegramId(id) {
        console.log("recuperando mensajes")
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT mensaje from bot.mensajes where telegramID=?", [id], (err, rows) => {
                resolve(rows)
                reject(err)
            })
        })
        return prom;
    }
}
module.exports = { usuarioDAO: usuarioDAO }