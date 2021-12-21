var express = require('express');
var router = express.Router();

var visitController = require('../controllers/visitController');

router.get('/create', visitController.create_get);
router.post('/create', visitController.create_post);

router.get('/:id/update', visitController.update_get);
router.post('/:id/update', visitController.update_post);

router.get('/:id/delete', visitController.delete_get);
router.post('/:id/delete', visitController.delete_post);

router.get('/', visitController.list);
router.get('/:id', visitController.detail);

module.exports = router;
