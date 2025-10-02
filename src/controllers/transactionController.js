const Transaction = require('../models/Transaction');

exports.listTransactions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const transactions = await Transaction.find(query).sort({ createdAt: -1 }).lean();
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
