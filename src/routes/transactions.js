const express = require('express');
const { listTransactions } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', listTransactions);

module.exports = router;
