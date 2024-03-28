var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const dbPrisma = new PrismaClient();

let composants = undefined
getComposants()

/* GET home page. */
router.get('/', function(req, res, next) {
  dbPrisma.item.findMany().then((resultat) => {
    res.render('index',  { composants: resultat });
  })
});

/* GET composants page. */
router.get('/composants', function(req, res, next) {
  dbPrisma.item.findMany().then((resultat) => {
    res.render('composants',  { composants: resultat });
  })
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});


async function getComposants() {
  const items = await dbPrisma.Item.findMany({
    include: {
      Category: true,
    },
  });
  composants = items
};

module.exports = router;
