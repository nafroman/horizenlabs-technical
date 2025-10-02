jest.mock('../src/models/Transaction', () => ({
  create: jest.fn(),
  find: jest.fn(),
}));

jest.mock('../src/services/ethereumService', () => ({
  sendTransaction: jest.fn(),
}));

const { ethers } = require('ethers');
const Transaction = require('../src/models/Transaction');
const { sendTransaction: sendTransactionService } = require('../src/services/ethereumService');
const sendController = require('../src/controllers/sendController');

describe('sendController', () => {
  const privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
  const toAddress = '0x0000000000000000000000000000000000000001';
  const wallet = new ethers.Wallet(privateKey);

  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockImplementation(function status(code) {
      this.statusCode = code;
      return this;
    });
    res.json = jest.fn().mockImplementation(function json(payload) {
      this.body = payload;
      return this;
    });
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persists a pending transaction and marks it confirmed when the send succeeds', async () => {
    const savedTransaction = { save: jest.fn().mockResolvedValue(), status: 'pending' };
    Transaction.create.mockResolvedValue(savedTransaction);
    sendTransactionService.mockResolvedValue('0xhash');

    const req = { body: { fromPrivateKey: privateKey, toAddress, amount: '0.5' } };
    const res = createResponse();

    await sendController.sendTransaction(req, res);

    expect(Transaction.create).toHaveBeenCalledWith({
      from: wallet.address,
      to: toAddress,
      amount: '0.5',
    });
    expect(sendTransactionService).toHaveBeenCalledWith(privateKey, toAddress, 500000000000000000n);
    expect(savedTransaction.txHash).toBe('0xhash');
    expect(savedTransaction.status).toBe('confirmed');
    expect(savedTransaction.save).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ txHash: '0xhash' });
  });

  it('marks the transaction as failed when sending throws', async () => {
    const savedTransaction = { save: jest.fn().mockResolvedValue(), status: 'pending' };
    Transaction.create.mockResolvedValue(savedTransaction);
    sendTransactionService.mockRejectedValue(new Error('send failure'));

    const req = { body: { fromPrivateKey: privateKey, toAddress, amount: '0.5' } };
    const res = createResponse();

    await sendController.sendTransaction(req, res);

    expect(savedTransaction.status).toBe('failed');
    expect(savedTransaction.error).toBe('send failure');
    expect(savedTransaction.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'send failure' });
  });

});
