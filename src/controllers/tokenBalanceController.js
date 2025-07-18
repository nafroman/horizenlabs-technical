// Controller for token balance logic (bonus)
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth_goerli');

const ERC20_ABI = [
	'function balanceOf(address owner) view returns (uint256)'
];

exports.getTokenBalance = async (req, res) => {
	try {
		const { address, tokenAddress } = req.params;
		if (!ethers.isAddress(address) || !ethers.isAddress(tokenAddress)) {
			return res.status(400).json({ error: 'Invalid address or tokenAddress' });
		}
		const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
		const balance = await contract.balanceOf(address);
		res.json({ address, tokenAddress, balance: balance.toString() });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
