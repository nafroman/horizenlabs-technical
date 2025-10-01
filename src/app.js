require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const balanceRoute = require('./routes/balance');
const sendRoute = require('./routes/send');
const networkRoute = require('./routes/network');
const tokenBalanceRoute = require('./routes/tokenBalance');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/balance', balanceRoute);
app.use('/send', sendRoute);
app.use('/network', networkRoute);
app.use('/token-balance', tokenBalanceRoute);

app.get('/', (req, res) => {
  res.send('Ethereum Blockchain Service API');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
