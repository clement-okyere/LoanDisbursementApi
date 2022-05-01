import LoanAccess from '../../src/dataAccess/loanAccess';
import { checkLoanExists } from '../../src/businessLogic/loan';

const mockGetLoan = jest.fn();

jest.mock('../../src/dataAccess/loanAccess');

describe.only('Business Logic', () => {
  beforeAll(() => {
    // @ts-ignore
    LoanAccess.mockImplementation(() => {
      return {
        getLoan: mockGetLoan,
      };
    });
  });

  it('returns false if loan does not exist', async function () {
    mockGetLoan.mockResolvedValue(undefined);

    const loanId = 'dcb33eb1-ac82-4383-981c-37358c462f73';
    const result = await checkLoanExists(loanId);
    expect(result).toBeFalsy();
  });
});
