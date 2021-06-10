const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');

router.get('/', bookController.all);
router.post('/', bookController.new);
router.get('/:id', bookController.one);
router.delete('/:id', bookController.remove);
router.patch('/:id', bookController.change);

module.exports = router;
