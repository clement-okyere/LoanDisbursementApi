import { APIGatewayProxyEventSample } from '../../fixtures/APIGatewayProxyEventSample';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/apps/loanManagement/getLoans';
import * as loanBusinessLogic from '../../../src/businessLogic/loan';
import { getLoansResponse } from '../../fixtures/getLoansResponse';

jest.mock('axios');

jest.mock('../../../src/businessLogic/loan');

describe('Get Loans', function () {
  it('get all loans successfully', async function () {
    // @ts-ignore
    loanBusinessLogic.getAllLoans.mockResolvedValue(getLoansResponse);

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.loans).toMatchObject(getLoansResponse);
  });

  it('throws a 500 error when an exception is thrown when getting a loan', async function () {
    const expectedError = new Error('Failed to get loans');

    // @ts-ignore
    loanBusinessLogic.getAllLoans.mockRejectedValue(expectedError);

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
  });
});
