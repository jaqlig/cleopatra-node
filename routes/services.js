var express = require('express');
var router = express.Router();

var serviceController = require('../controllers/serviceController');

router.get('/create', function(req, res, next) {res.render('service/new');});
router.post('/create', serviceController.create_post);

router.get('/:id/update', serviceController.update_get);
router.post('/:id/update', serviceController.update_post);

router.get('/:id/delete', serviceController.delete_get);
router.post('/:id/delete', serviceController.delete_post);

router.get('/', serviceController.list);
router.get('/:id', serviceController.detail);

module.exports = router;
