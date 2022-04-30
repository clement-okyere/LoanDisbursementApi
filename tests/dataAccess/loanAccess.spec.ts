import { LoanAccess } from '../../src/dataAccess/loanAccess';
import { createLoanResponse } from '../fixtures/createLoanRespose';
import { Loan } from '../../src/models/loan';
import { getLoanResponse } from '../fixtures/getLoanResponse';

const mockDocumentClient = {
  get: {
    promise: jest.fn(),
  },
  scan: {
    promise: jest.fn(),
  },
  put: {
    promise: jest.fn(),
  },
  delete: {
    promise: jest.fn(),
  },
  update: {
    promise: jest.fn(),
  },
};

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          get: () => mockDocumentClient.get,
          scan: () => mockDocumentClient.scan,
          put: () => mockDocumentClient.put,
          delete: () => mockDocumentClient.delete,
          update: () => mockDocumentClient.update,
        };
      }),
    },
  };
});

const loanAccess = new LoanAccess();

describe('Data Access', () => {
  it('returns all loans', async function () {
    mockDocumentClient.scan.promise.mockReturnValueOnce({
      Items: createLoanResponse,
    });

    const result = await loanAccess.getAllLoans();
    expect(result).toEqual(createLoanResponse);
  });

  it('returns loan by specified id', async function () {
    mockDocumentClient.get.promise.mockReturnValueOnce({
      Item: getLoanResponse,
    });

    const loanId = 'dcb33eb1-ac82-4383-981c-37358c462f73';
    const result = await loanAccess.getLoan(loanId);
    expect(result).toEqual(getLoanResponse);
  });

  it('creates a loan sunccessfully with loan payload', async function () {
    mockDocumentClient.put.promise.mockReturnValueOnce(getLoanResponse as Loan);

    const result = await loanAccess.createLoan(getLoanResponse as Loan);
    expect(result).toEqual(getLoanResponse);
  });

  it('deletes loan by specified id successfully', async function () {
    mockDocumentClient.delete.promise.mockReturnValueOnce({
      $response: {
        data: [],
      },
    });

    const loanId = 'dcb33eb1-ac82-4383-981c-37358c462f73';
    const result = await loanAccess.deleteLoan(loanId);
    expect(result).toEqual([]);
  });

  it('updates specified loan status successfully', async function () {
    mockDocumentClient.update.promise.mockReturnValueOnce({
      $response: {
        data: [],
      },
    });

    const loanId = 'dcb33eb1-ac82-4383-981c-37358c462f73';
    const result = await loanAccess.updateLoan(loanId, 'status', 'offered');
    expect(result).toEqual([]);
  });
});
