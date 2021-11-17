var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cleopatra' });
});

router.get('/express_backend', (req, res) => {
  res.send({ express: 'NODEJS BACKEND CONNECTED TO REACT' });
});

module.exports = router;
