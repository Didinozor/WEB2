var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/* GET home page. */
router.get('/', async (req, res, next) => {
  const total = await prisma.item.count()
  res.render('index', { composants: total });
});

router.get('/composants', async (req, res, next) => {
  const categories = await prisma.category.findMany()
  prisma.item.findMany({
    include: {
      Category: true
    }
  }).then(items => {
    res.render('composants', { items: items, categories: categories });
  })
  
});

router.post('/composants', async (req, res, next)=>{
  const idCategory = Number(req.body.category)
  const ref = req.body.ref
  const desc = req.body.desc
  const price = Number(req.body.price)
  const location = Number(req.body.loc)

  // Ajout du composant (INSERT)
  const newItem = await prisma.item.create({
    data:{
      idCategory: idCategory,
      price: price,
      qty: 0,
      ref: ref,
      description: desc,
      location: location
   }
  })

  console.log(newItem);

  res.status(200).redirect('composants')
})

router.get('/about', (req, res, next) => {
  res.render('about', {  });
});

module.exports = router;
