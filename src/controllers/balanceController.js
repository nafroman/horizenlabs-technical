// Controller for balance logic
const { ethers } = require('ethers');

// Connect to Ethereum testnet (Goerli by default)
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth_goerli');

exports.getBalance = async (req, res) => {
	try {
		const { address } = req.params;
		if (!ethers.isAddress(address)) {
			return res.status(400).json({ error: 'Invalid Ethereum address' });
		}
		const balance = await provider.getBalance(address);
		res.json({ address, balance: ethers.formatEther(balance) });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
