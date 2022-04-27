import { APIGatewayProxyEventSample } from '../../fixtures/APIGatewayProxyEventSample';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/apps/loanManagement/deleteLoan';
import * as loanBusinessLogic from '../../../src/businessLogic/loan';

jest.mock('axios');

jest.mock('../../../src/businessLogic/loan');

describe('Delete Loan', function () {
  it('throws a 400 error when loan does not exist', async function () {
    // @ts-ignore
    loanBusinessLogic.checkLoanExists.mockResolvedValue(false);

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        pathParameters: {
          id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
        },
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(404);
  });

  it('deletes loan successfully loan exists', async function () {
    // @ts-ignore
    loanBusinessLogic.checkLoanExists.mockResolvedValue(true);

    // @ts-ignore
    loanBusinessLogic.deleteLoan.mockResolvedValue();

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        pathParameters: {
          id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
        },
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('Loan deleted successfully');
  });

  it('throws a 500 error when an exception is thrown when deleting loan', async function () {
    // @ts-ignore
    loanBusinessLogic.checkLoanExists.mockResolvedValue(true);

    const expectedError = new Error('Failed to delete loan');

    // @ts-ignore
    loanBusinessLogic.deleteLoan.mockRejectedValue(expectedError);

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        pathParameters: {
          id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
        },
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
  });
});
