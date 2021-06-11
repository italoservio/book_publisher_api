const express = require('express');
const router = express.Router();

const statusController = require('../controllers/statusController');

router.get('/', statusController.all);
router.post('/', statusController.new);
router.get('/:id', statusController.one);
router.delete('/:id', statusController.remove);
router.patch('/', statusController.change);

module.exports = router;
