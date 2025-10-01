const { ethers } = require('ethers');
const { getBalance } = require('../services/ethereumService');

exports.getBalance = async (req, res) => {
	try {
		const { address } = req.params;
		if (!ethers.isAddress(address)) {
			return res.status(400).json({ error: 'Invalid Ethereum address' });
		}

		const balance = await getBalance(address);
		res.json({ address, balance });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
