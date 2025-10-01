const express = require('express');
const { getNetwork } = require('../controllers/networkController');

const router = express.Router();

router.get('/', getNetwork);

module.exports = router;
