var express = require('express');
var router = express.Router();

let fB = require('../funcionesBot').funcionesBot
//METODO MIO
router.get('/', function (req, res, next) {
  res.render('mensaje')
})

router.post("/generate", function (req, res, next) {
  let mensaje = req.body.mensaje
  // en bot.js YA tengo un metodo que manda un[mensaje] a toda la BD, asi que lo llamo Y FUNSIONA
  fB.spamear([mensaje], null, true)
  res.redirect("/vista")
  //PUEDO MANDAR ALGO POR UN REDIRECT ?? SON LOS REDIRECT GETS?
}

)



module.exports = router;
