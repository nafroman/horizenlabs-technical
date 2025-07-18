// Controller for send logic
const { ethers } = require('ethers');

// Connect to Ethereum testnet (Goerli by default)
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth_goerli');

exports.sendTransaction = async (req, res) => {
	try {
		const { fromPrivateKey, toAddress, amount } = req.body;
		if (!fromPrivateKey || !toAddress || !amount) {
			return res.status(400).json({ error: 'Missing required fields' });
		}
		if (!ethers.isAddress(toAddress)) {
			return res.status(400).json({ error: 'Invalid toAddress' });
		}
		const wallet = new ethers.Wallet(fromPrivateKey, provider);
		const tx = await wallet.sendTransaction({
			to: toAddress,
			value: ethers.parseEther(amount.toString()),
		});
		await tx.wait();
		res.json({ txHash: tx.hash });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
