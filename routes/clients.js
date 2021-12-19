var express = require('express');
var router = express.Router();

var clientController = require('../controllers/clientController');

router.get('/create', function(req, res, next) {res.render('client/new');});
// router.post('/create', clientController.create_post);

// router.get('/:id/update', clientController.update_get);
// router.post('/:id/update', clientController.update_post);

// router.get('/:id/delete', clientController.delete_get);
// router.post('/:id/delete', clientController.delete_post);

router.get('/', clientController.list);
router.get('/:id', clientController.detail);

module.exports = router;
