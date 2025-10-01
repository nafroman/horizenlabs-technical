const { ethers } = require('ethers');

const rpcUrl = process.env.ETH_RPC_URL || 'https://rpc.ankr.com/eth_holesky';
const provider = new ethers.JsonRpcProvider(rpcUrl);
const erc20Abi = ['function balanceOf(address owner) view returns (uint256)'];

async function getBalance(address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

async function sendTransaction(fromPrivateKey, toAddress, amount) {
  const wallet = new ethers.Wallet(fromPrivateKey, provider);
  const value = typeof amount === 'bigint' ? amount : ethers.parseEther(amount.toString());
  const transaction = await wallet.sendTransaction({
    to: toAddress,
    value,
  });
  await transaction.wait();
  return transaction.hash;
}

async function getNetwork() {
  const network = await provider.getNetwork();
  return {
    chainId: Number(network.chainId),
    name: network.name,
  };
}

async function getTokenBalance(address, tokenAddress) {
  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  const balance = await contract.balanceOf(address);
  return balance.toString();
}

module.exports = {
  getBalance,
  sendTransaction,
  getNetwork,
  getTokenBalance,
};
