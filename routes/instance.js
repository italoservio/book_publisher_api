const express = require('express');
const router = express.Router();

const instanceController = require('../controllers/instanceController');

router.get('/', instanceController.all);
router.post('/', instanceController.new);
router.get('/:id', instanceController.one);
router.delete('/:id', instanceController.remove);
router.patch('/:id', instanceController.change);

module.exports = router;
