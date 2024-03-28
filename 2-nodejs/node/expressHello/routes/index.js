var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// Add a new route
router.get('/toto', function(req, res, next) {
  res.render('index', { title: 'Toto' });
});

module.exports = router;
