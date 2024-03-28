var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const dbPrisma = new PrismaClient();

//const MAX_CAPTEURS = 6
let capteurs = undefined
getCapteurs()
//const capteurs = []

// Génération des capteurs
// for (let index = 1; index <= MAX_CAPTEURS; index++) {
  // On créé un capteur
//   const capteur = {
//    id: index,
//    mesure: Math.floor(Math.random() * 100),
//    date: new Date()
//  }
  // Et on l'envoie dans le tableau
//  capteurs.push(capteur)
//}

/* GET home page. */
router.get('/', function(req, res, next) {
  // getCapteurs()
  dbPrisma.capteur.findMany().then((resultat) => {
    res.render('index',  { capteurs: resultat });
  })
});

/* GET capteurs page. */
router.get('/capteurs', function(req, res, next) {
  dbPrisma.capteur.findMany().then((resultat) => {
    res.render('capteurs',  { capteurs: resultat });
  })
});

/* POST capteurs page */
router.post('/capteurs', async function(req, res, next) {

  // On récupère les données du formulaire
  const data = req.body
  const name = data.nom
  const mesure = data.mesure
  const id = 0

  console.log("Nous avons reçu un nouveau capteur: "+ name + " " + mesure);

  // On ajoute le capteur dans la base de données
  try {
    const resultat = await dbPrisma.capteur.create({
      data: {
        name: name,
        mesure: Number(mesure)
      }
    });

    res.redirect('/capteurs');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error while creating the sensor');
  }

});
  /* GET about page. */
  router.get('/about', function(req, res, next) {
    res.render('about');
  });


async function getCapteurs() {
  const resultat = await dbPrisma.capteur.findMany()
  capteurs = resultat
};

module.exports = router;
