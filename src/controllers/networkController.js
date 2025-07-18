// Controller for network logic (bonus)
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth_goerli');

exports.getNetwork = async (req, res) => {
	try {
		const network = await provider.getNetwork();
		res.json({ chainId: network.chainId, name: network.name });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
