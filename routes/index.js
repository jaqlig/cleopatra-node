var express = require('express');
var router = express.Router();

var hairdresserController = require('../controllers/hairdresserController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cleopatra' });
});

router.get('/hairdresser/:id', hairdresserController.detail);

// router.get('/hairdresser/create', hairdresserController.hairdresser_create_get);
// router.post('/hairdresser/create', hairdresserController.hairdresser_create_post);

// router.get('/hairdresser/:id/update', hairdresserController.hairdresser_update_get);
// router.post('/hairdresser/:id/update', hairdresserController.hairdresser_update_post);

// router.get('/hairdresser/:id/delete', hairdresserController.hairdresser_delete_get);
// router.post('/hairdresser/:id/delete', hairdresserController.hairdresser_delete_post);

module.exports = router;
