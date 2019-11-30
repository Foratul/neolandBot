var express = require('express');
const Telegraf = require('telegraf')

let creadores = require('./creadores') //ARRAY CHORRA CON LOS CREADORES
let mensajes = require('./mensajes.js') // ARRAY CON LOS MENSAJES 
let usuarioDAO = require("./usuarioDAO").usuarioDAO //OBJETO DE ACCESO A DATOS 
var app = express();


bot = new Telegraf('1041852626:AAFV8bkJxE5t8AeuiQZIXI3xogsQk7Gvpec')
bot.telegram.setWebhook('https://4153f7c3.ngrok.io/rutabot')
bot.startWebhook('/ruta', 8443)

function cargarfuncionesBot() { }
// setTimeout(cargarfuncionesBot, 1000)
let fB = require("./funcionesBot").funcionesBot

// cargarfuncionesBot()
bot.start((ctx) => {
    ctx.reply('Hola hamijo ' + ctx.from.first_name + " " + ctx.from.last_name)
    ctx.reply('Yo me llamo ' + ctx.options.username)

    fB.dameInfo(ctx) //se llama mostrar info

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
    fB.spamear(['spam'], ctx.from.id)
})

//se mandan mensajes random a TODOS LOS USUARIOS
bot.command("/random2", (ctx) => {
    fB.spamear(mensajes.generalistas)
})

//se mandan mensaje concreto a usuario random
bot.command("/random", (ctx) => {
    let mensaje = ctx.message.text.split("/random")[1]
    console.log(mensaje)
    fB.spamear([mensaje, null, false])
})

//EL BOT SPAMEA CON MENSAJES DE MARIO al usuario actual
bot.command("/Mario", (ctx) => {
    console.log("Mario")
    fB.spamear(mensajes.marioLingo, ctx.from.id)
})


bot.command("/users", (ctx) => {
    console.log("/users")
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
    fB.mensajearUsuario(mensaje, variableCensurada)
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
    console.log("/info")
    fB.dameInfo(ctx)
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
        .then((result) => { console.log("mensaje guardado en la BD") })
        .catch((err) => { console.log(err) })
})
bot.hears('hola', (ctx) => ctx.reply('hola hamijo')) //no se activa si se hace hola antes
bot.launch()

app.listen(8000, () => { console.log("servidor listening") })

// exporto la funciones  que quiero usar fuera y a vivir la vida

