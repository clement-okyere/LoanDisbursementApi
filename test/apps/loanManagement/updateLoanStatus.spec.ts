import { APIGatewayProxyEventSample } from '../../fixtures/APIGatewayProxyEventSample';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/apps/loanManagement/updateLoanStatus';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../../src/businessLogic/loan');

describe('Update Loan Status', function () {
  it('throws an error when wrong status is passed', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        pathParameters: {
          id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
        },
        body: JSON.stringify({
          status: 'offer',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('"status" must be one of [offered, disbursed]');
  });

  it('updates loan successfully when call to disbursement api succeeds', async function () {
    // @ts-ignore comment
    axios.patch.mockResolvedValueOnce({ status: 200 });

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        pathParameters: {
          id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
        },
        body: JSON.stringify({
          status: 'disbursed',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
  });

  it('throws a 400 error when call to disbursement api fails', async function () {
    const expectedError = new Error('call to disbursement api failed');
    // @ts-ignore
    axios.patch.mockRejectedValueOnce(expectedError);

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        pathParameters: {
          id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
        },
        body: JSON.stringify({
          status: 'disbursed',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
  });
});
