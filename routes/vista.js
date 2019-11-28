var express = require('express');
var router = express.Router();
let usuarioDAO = require("../usuarioDAO.js").usuarioDAO
let app = require('../app.js')
let bot = require('../bot.js')
//METODO MIO
router.get('/', function (req, res, next) {
  res.render('mensaje')
})

router.post("/generate", function (req, res, next) {
  let mensaje = req.body.mensaje
  // en bot.js YA tengo un metodo que manda un[mensaje] a toda la BD, asi que lo llamo Y FUNSIONA
  bot.spamear([mensaje])
  res.redirect("/vista")
  //PUEDO MANDAR ALGO POR UN REDIRECT ?? SON LOS REDIRECT GETS?
}

)



module.exports = router;
