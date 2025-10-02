const { ethers } = require('ethers');
const { sendTransaction } = require('../services/ethereumService');
const Transaction = require('../models/Transaction');

exports.sendTransaction = async (req, res) => {
	let transactionDoc;
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
		const wallet = new ethers.Wallet(fromPrivateKey);
		const formattedAmount = ethers.formatEther(parsedAmount);
		transactionDoc = await Transaction.create({
			from: wallet.address,
			to: toAddress,
			amount: formattedAmount,
		});
		const txHash = await sendTransaction(fromPrivateKey, toAddress, parsedAmount);
		transactionDoc.txHash = txHash;
		transactionDoc.status = 'confirmed';
		await transactionDoc.save();
		res.json({ txHash });
	} catch (err) {
		if (transactionDoc) {
			try {
				transactionDoc.status = 'failed';
				transactionDoc.error = err.message;
				await transactionDoc.save();
			} catch (_) {}
		}
		res.status(500).json({ error: err.message });
	}
};