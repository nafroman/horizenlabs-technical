jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  const { ethers: actualEthers } = actual;

  const mockGetBalance = jest.fn();
  const mockGetNetwork = jest.fn();
  const mockBalanceOf = jest.fn();
  const mockSendTransaction = jest.fn();

  const mockProvider = {
    getBalance: mockGetBalance,
    getNetwork: mockGetNetwork,
  };

  const mockedJsonRpcProvider = jest.fn().mockImplementation(() => mockProvider);
  const mockedWallet = jest.fn().mockImplementation(() => ({
    sendTransaction: mockSendTransaction,
  }));
  const mockedContract = jest.fn().mockImplementation(() => ({
    balanceOf: mockBalanceOf,
  }));

  const mockedEthers = {
    ...actualEthers,
    JsonRpcProvider: mockedJsonRpcProvider,
    Wallet: mockedWallet,
    Contract: mockedContract,
  };

  mockedEthers.__mocked = {
    provider: mockProvider,
    getBalance: mockGetBalance,
    getNetwork: mockGetNetwork,
    balanceOf: mockBalanceOf,
    sendTransaction: mockSendTransaction,
    jsonRpcProvider: mockedJsonRpcProvider,
    wallet: mockedWallet,
    contract: mockedContract,
  };

  return { ethers: mockedEthers };
});

const { ethers } = require('ethers');
const ethereumService = require('../src/services/ethereumService');

const { __mocked } = ethers;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ethereumService', () => {
  describe('getBalance', () => {
    it('returns formatted ETH balance from provider', async () => {
      const weiBalance = 1000000000000000000n;
      __mocked.getBalance.mockResolvedValueOnce(weiBalance);

      const result = await ethereumService.getBalance('0xabc');

      expect(__mocked.getBalance).toHaveBeenCalledWith('0xabc');
      expect(result).toBe('1.0');
    });
  });

  describe('sendTransaction', () => {
    it('parses amount, sends transaction, waits for confirmation, and returns hash', async () => {
      const wait = jest.fn().mockResolvedValue();
      const hash = '0x123';
      __mocked.sendTransaction.mockResolvedValueOnce({ hash, wait });

      const parseSpy = jest.spyOn(ethers, 'parseEther');

      const result = await ethereumService.sendTransaction(
        '0xprivkey',
        '0xrecipient',
        '0.5'
      );

      expect(ethers.Wallet).toHaveBeenCalledWith('0xprivkey', __mocked.provider);
      expect(parseSpy).toHaveBeenCalledWith('0.5');
      expect(__mocked.sendTransaction).toHaveBeenCalledWith({
        to: '0xrecipient',
        value: 500000000000000000n,
      });
      expect(wait).toHaveBeenCalled();
      expect(result).toBe(hash);

      parseSpy.mockRestore();
    });
  });

  describe('getNetwork', () => {
    it('returns numeric chainId and network name', async () => {
      __mocked.getNetwork.mockResolvedValueOnce({ chainId: 17000n, name: 'holesky' });

      const result = await ethereumService.getNetwork();

      expect(__mocked.getNetwork).toHaveBeenCalled();
      expect(result).toEqual({ chainId: 17000, name: 'holesky' });
    });
  });

  describe('getTokenBalance', () => {
    it('reads ERC-20 balance using contract instance', async () => {
      __mocked.balanceOf.mockResolvedValueOnce(123456789n);

      const result = await ethereumService.getTokenBalance(
        '0xholder',
        '0xtoken'
      );

      expect(ethers.Contract).toHaveBeenCalledWith(
        '0xtoken',
        ['function balanceOf(address owner) view returns (uint256)'],
        __mocked.provider
      );
      expect(__mocked.balanceOf).toHaveBeenCalledWith('0xholder');
      expect(result).toBe('123456789');
    });
  });
});
