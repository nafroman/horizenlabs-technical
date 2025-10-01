const express = require('express');
const { getTokenBalance } = require('../controllers/tokenBalanceController');

const router = express.Router();

router.get('/:address/:tokenAddress', getTokenBalance);

module.exports = router;
