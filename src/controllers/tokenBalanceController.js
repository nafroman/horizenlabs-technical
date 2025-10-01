const { ethers } = require('ethers');
const { getTokenBalance } = require('../services/ethereumService');

exports.getTokenBalance = async (req, res) => {
	try {
		const { address, tokenAddress } = req.params;
		if (!ethers.isAddress(address) || !ethers.isAddress(tokenAddress)) {
			return res.status(400).json({ error: 'Invalid address or tokenAddress' });
		}
		const balance = await getTokenBalance(address, tokenAddress);
		res.json({ address, tokenAddress, balance });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
