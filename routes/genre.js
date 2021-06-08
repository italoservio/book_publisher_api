const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');

router.get('/', genreController.all);
router.post('/', genreController.new);
router.get('/:id', genreController.one);
router.delete('/:id', genreController.remove);
router.patch('/:id', genreController.change);

module.exports = router;
