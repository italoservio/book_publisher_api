const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');

router.get('/', authorController.all);
router.post('/', authorController.new);
router.get('/:id', authorController.one);
router.delete('/:id', authorController.remove);
router.patch('/:id', authorController.change);

module.exports = router;
