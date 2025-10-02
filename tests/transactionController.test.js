jest.mock('../src/models/Transaction', () => ({
  find: jest.fn(),
}));

const Transaction = require('../src/models/Transaction');
const transactionController = require('../src/controllers/transactionController');

describe('transactionController', () => {
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

  it('returns stored transactions ordered by recency', async () => {
    const lean = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const sort = jest.fn().mockReturnValue({ lean });
    Transaction.find.mockReturnValue({ sort });

    const req = { query: {} };
    const res = createResponse();

    await transactionController.listTransactions(req, res);

    expect(Transaction.find).toHaveBeenCalledWith({});
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(lean).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ transactions: [{ id: 1 }, { id: 2 }] });
  });

  it('applies a status filter when provided', async () => {
    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    Transaction.find.mockReturnValue({ sort });

    const req = { query: { status: 'failed' } };
    const res = createResponse();

    await transactionController.listTransactions(req, res);

    expect(Transaction.find).toHaveBeenCalledWith({ status: 'failed' });
    expect(res.json).toHaveBeenCalledWith({ transactions: [] });
  });

  it('returns 500 when the query throws', async () => {
    const error = new Error('boom');
    Transaction.find.mockImplementation(() => { throw error; });

    const req = { query: {} };
    const res = createResponse();

    await transactionController.listTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' });
  });
});
