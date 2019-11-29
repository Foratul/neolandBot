var express = require('express');
const Telegraf = require('telegraf')
let creadores = require('./creadores') //ARRAY CHORRA CON LOS CREADORES
let funsiones = require('./funsiones.js')  // ARRAY CON LOS COMANDOS DISPONIBLES 
let mensajes = require('./mensajes.js') // ARRAY CON LOS MENSAJES 
let usuarioDAO = require("./usuarioDAO").usuarioDAO //OBJETO DE ACCESO A DATOS 
var app = express();


const bot = new Telegraf('1041852626:AAFV8bkJxE5t8AeuiQZIXI3xogsQk7Gvpec')
bot.telegram.setWebhook('https://23a0945d.ngrok.io/rutabot')

bot.start((ctx) => {
    ctx.reply('Hola hamijo ' + ctx.from.first_name + " " + ctx.from.last_name)
    ctx.reply('Yo me llamo ' + ctx.options.username)

    dameInfo(ctx) //se llama mostrar info

    // se comprueba si el usuario esta en la BD
    usuarioDAO.getByTelegramID(ctx.from.id)
        .then((resultado) => {
            if (resultado.length == 0) {
                console.log("usuario no existe") // con lo cual lo añado y saludo segun
                ctx.reply("Encantado de conocerte")
                usuarioDAO.insertUsuario(ctx.from).then((resultado) => { console.log(resultado) })
            }
            else {
                console.log("el usuario ya existe")
                ctx.reply("Encantado de volver a verte")
            }
        })
})


bot.command("/spam", (ctx) => {
    spamear(['spam'])
})

//se mandan mensajes random a TODOS LOS USUARIOS
bot.command("/random2", (ctx) => {
    spamear(mensajes.generalistas)
})

//se mandan mensajes random a UN USUARIO

bot.command("/random", (ctx) => {
    let mensaje = ctx.message.text.split(" ")[1]
    console.log(mensaje)
    mensajearUsuario(mensaje)
})

//EL BOT SPAMEA CON MENSAJES DE MARIO
bot.command("/Mario", (ctx) => {
    spamear(mensajes.marioLingo, Mario = true)
})

//esta funcion recibe un arraymensajes y manda uno aleatorio a todos los usuarios registradso
function spamear(arrayMensajes, Mario = false) {
    let prefacio = (Mario) ? "Mario dice : " : ""
    usuarioDAO.getAll().then((rows) => {
        for (const usuario of rows) {
            bot.telegram.sendMessage(usuario.telegramID,
                prefacio + arrayMensajes[Math.floor(Math.random() * (arrayMensajes.length))])
        }
    })
}

function mensajearUsuario(mensaje = "no me ha llegado nada", destinatario = null) {

    if (destinatario === null) { //si viene nulo se lo mando a uno aleatorio de la base de datos
        usuarioDAO.getAll().then((rows) => {
            let aleatorio = Math.floor(Math.random() * (rows.length))
            bot.telegram.setAsyncRequest(true).sendMessage(rows[aleatorio].telegramID, mensaje)
        })
    }
    // si no, se lo mando a una id concreta que me han pasado por parametro
    else bot.telegram.sendMessage(destinatario, mensaje)
}

bot.command("/users", (ctx) => {
    ctx.reply("USUARIOS QUE HAN ENTRADO ALGUNA VEZ")
    // MUESTRA TODOS LOS USUARIOS EN LA BD
    usuarioDAO.getAll().then((rows) => {
        for (const resultado of rows) {
            ctx.reply(resultado.first_name + " " + resultado.last_name + " tiene de username : " + resultado.username)
        }
    })
})

bot.command('/test', (parametros) => {
    console.log("test")
    parametros.reply('bot funsiona')
})

// FUNCION NO DOCUMENTADA POR SI QUEREMOS MANDAR A MARIO SPAM

bot.command('/SendMario', (ctx) => {
    let mensaje = ctx.message.text
    console.log("Para Mario va " + mensaje)
    mensajearUsuario(mensaje, variableCensurada)


})

bot.command('/creadores', (parametros) => {
    console.log("test")
    let texto = ""
    for (const elemento of creadores) {
        texto += "AUTOR: " + elemento.nombre + " DATOS :" + elemento.datos + "\n"
    }
    parametros.reply(texto)
})

bot.command('/info', (ctx) => {
    dameInfo(ctx)
})

bot.command("/crearDatabase", (ctx) => {

    //hay problemas si no se hace por pasos , tocar repetir algo
    usuarioDAO.crearDatabase1()
        .then((resultado) => {
            ctx.reply(resultado)
        })
        .catch((error) => {
            ctx.reply(error)
        })
    usuarioDAO.crearDatabase2()
        .then((resultado) => {
            ctx.reply(resultado)
        })
        .catch((error) => {
            ctx.reply(error)
        })
})

bot.command("/misMensajes", (ctx) => {
    usuarioDAO.getMensajesByTelegramId(ctx.from.id)
        .then((rows) => {
            ctx.reply("HEMOS ALMACENADO DE USTED :")
            for (const row of rows) {
                ctx.reply(row.mensaje)
            }
        })
        .catch((error) => {
            ctx.reply("ALGO SALIO MAL")
            console.log(error)
        })

})
function dameInfo(ctx) {
    // se pega la info asi que timeouts chungos
    setTimeout(() => {
        ctx.reply("TENGO DISPONIBLES ESTAS FUNSIONES")
    }, 500)
    setTimeout(() => {
        for (const funsion of funsiones) {
            ctx.reply(funsion)
        }
    }, 800)

}

// app.post('/rutabot', (req, res) => {
//     console.log(req)
//     res.JSON("RUTA BOT")
// })

bot.command('/start', (ctx) => {
    ctx.reply("Ya se he hecho /start antes de que tu mirases por otro lado")
})

//tengo un escuchador que se dispara con texto escrito, pero no registra cuando hay comandos
bot.on('text', (ctx) => {
    let escrito = ctx.message.text
    let respuesta
    if (escrito.includes("adios")) respuesta = "Pues adiós, yo aqui me quedo programando"
    else respuesta = "¿Por qué me dices " + escrito + " ?"
    ctx.reply(respuesta)
    //guarda el mensaje en la
    usuarioDAO.guardarMensaje(escrito, ctx.message.from.id)
        .then((result) => { console.log(result) })
        .catch((err) => { console.log(err) })
})
bot.hears('hola', (ctx) => ctx.reply('hola hamijo')) //no se activa si se hace hola antes
bot.launch()

app.listen(8000, () => { console.log("servidor listening") })

module.exports = { spamear: spamear }
// exporto la funciones  que quiero usar fuera y a vivir la vida