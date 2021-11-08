var express = require('express');
var router = express.Router();

var hairdresserController = require('../controllers/hairdresserController');

// router.get('/create', hairdresserController.hairdresser_create_get);
// router.post('/create', hairdresserController.hairdresser_create_post);

// router.get('/:id/update', hairdresserController.hairdresser_update_get);
// router.post('/:id/update', hairdresserController.hairdresser_update_post);

// router.get('/:id/delete', hairdresserController.hairdresser_delete_get);
// router.post('/:id/delete', hairdresserController.hairdresser_delete_post);

router.get('/', hairdresserController.list);
router.get('/:id', hairdresserController.detail);

module.exports = router;
