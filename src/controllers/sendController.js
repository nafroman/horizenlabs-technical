const { ethers } = require('ethers');
const { sendTransaction } = require('../services/ethereumService');

exports.sendTransaction = async (req, res) => {
	try {
		const { fromPrivateKey, toAddress, amount } = req.body;
		if (!fromPrivateKey || !toAddress || amount === undefined) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		if (!ethers.isAddress(toAddress)) {
			return res.status(400).json({ error: 'Invalid toAddress' });
		}
		let parsedAmount;
		try {
			parsedAmount = ethers.parseEther(String(amount));
		} catch (parseError) {
			return res.status(400).json({ error: 'Amount must be positive' });
		}
		if (parsedAmount <= 0n) {
			return res.status(400).json({ error: 'Amount must be more than zero' });
		}
		const txHash = await sendTransaction(fromPrivateKey, toAddress, parsedAmount);
		res.json({ txHash });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
