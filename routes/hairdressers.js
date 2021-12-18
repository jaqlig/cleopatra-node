var express = require('express');
var router = express.Router();

var hairdresserController = require('../controllers/hairdresserController');

router.get('/create', function(req, res, next) {res.render('new_hairdresser');});
router.post('/create', hairdresserController.create_post);

router.get('/:id/update', hairdresserController.update_get);
router.post('/:id/update', hairdresserController.update_post);

router.get('/:id/delete', hairdresserController.delete_get);
router.post('/:id/delete', hairdresserController.delete_post);

router.get('/', hairdresserController.list);
router.get('/:id', hairdresserController.detail);

module.exports = router;
