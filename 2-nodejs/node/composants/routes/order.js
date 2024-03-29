var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


router.post('/addBasket', async (req, res, next)=> {
    const itemId = Number(req.body.id)
    let basket = req.cookies.basket
    
    if(!basket) basket = []
    console.log(" - current basket " + itemId);
    console.log(" - ajout item ID " + itemId);
    const item = await prisma.item.findUnique({where: {idItem: itemId}})
    if(item){
      basket.push(item)
      res.cookie('basket', basket);

      console.log("Taille panier " + basket.length);
      res.status(200).json({status: 'ok'})
    }
    else{
      res.status(404).json({status: 'Unknown component.'})
    }
})

router.post('/clearBasket', async (req, res, next)=> {
    res.clearCookie('basket')
    res.status(200).json({status: 'ok'})
})

router.post('/placeOrder', async (req, res, next)=> {
    // TODO
})

module.exports = router
