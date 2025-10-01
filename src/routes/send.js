const express = require('express');
const { sendTransaction } = require('../controllers/sendController');

const router = express.Router();

router.post('/', sendTransaction);

module.exports = router;
