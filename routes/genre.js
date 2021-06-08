const express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');

router.get('/', genreController.all);
router.post('/', genreController.new);

module.exports = router;
