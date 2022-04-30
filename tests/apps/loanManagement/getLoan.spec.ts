import { APIGatewayProxyEventSample } from '../../fixtures/APIGatewayProxyEventSample';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/apps/loanManagement/getLoan';
import * as loanBusinessLogic from '../../../src/businessLogic/loan';
import { getLoanResponse } from '../../fixtures/getLoanResponse';

jest.mock('axios');

jest.mock('../../../src/businessLogic/loan');

describe('Get Loan', function () {
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

  it('get loan successfully loan exists', async function () {
    // @ts-ignore
    loanBusinessLogic.checkLoanExists.mockResolvedValue(true);

    // @ts-ignore
    loanBusinessLogic.getLoan.mockResolvedValue(getLoanResponse);

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
    expect(parsedResponse).toMatchObject(getLoanResponse);
  });

  it('throws a 500 error when an exception is thrown when getting a loan', async function () {
    // @ts-ignore
    loanBusinessLogic.checkLoanExists.mockResolvedValue(true);

    const expectedError = new Error('Failed to get loan');

    // @ts-ignore
    loanBusinessLogic.getLoan.mockRejectedValue(expectedError);

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
