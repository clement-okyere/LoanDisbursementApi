import { APIGatewayProxyEventSample } from '../../fixtures/APIGatewayProxyEventSample';
import { company } from '../../fixtures/company';
import { createLoanResponse } from '../../fixtures/createLoanRespose';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../../src/apps/loanManagement/createLoan';
import * as loanBusinessLogic from '../../../src/businessLogic/loan';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../../src/businessLogic/loan');

describe('Create Loan', function () {
  it('throws a 400 error when company Id is not provided', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
  });

  it('throws a 400 error when request body does not have amount', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          status: 'offered',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('"amount" is required');
  });

  it('throws a 400 error when request body  does not have status', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: '400',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('"status" is required');
  });

  it('throws a 400 error when request body  does not have status', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: 10,
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('"status" is required');
  });

  it('throws a 400 error when amount is not a number', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: 'ten',
          status: 'offered',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('"amount" must be a number');
  });

  it('throws a 400 error when status is not offered or disbursed', async function () {
    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: 10,
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

  it('throws a 400 error when company is not active', async function () {
    // @ts-ignore comment
    axios.get.mockResolvedValueOnce({
      data: {
        ...company,
        actief: false,
      },
    });

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: 10,
          status: 'offered',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse.message).toBe('Company with id test is not active');
  });

  it('adds loan successfully when company is  active', async function () {
    // @ts-ignore comment
    axios.get.mockResolvedValueOnce({ data: company });

    // @ts-ignore comment
    loanBusinessLogic.createLoan.mockResolvedValue({
      id: 'dcb33eb1-ac82-4383-981c-37358c462f73',
      amount: 10,
      status: 'offered',
      company,
    });

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: 10,
          status: 'offered',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    const parsedResponse = JSON.parse(response.body);
    expect(parsedResponse).toMatchObject(createLoanResponse);
  });

  it('throws a 500 error when an exception is thrown when creating loan', async function () {
    // @ts-ignore comment
    axios.get.mockResolvedValueOnce({ data: company });

    const expectedError = new Error('Failed to create loan');

    // @ts-ignore comment
    loanBusinessLogic.createLoan.mockRejectedValue(expectedError);

    const response = (await handler(
      {
        ...APIGatewayProxyEventSample,
        queryStringParameters: {
          companyId: 'test',
        },
        body: JSON.stringify({
          amount: 10,
          status: 'offered',
        }),
      },
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(500);
  });
});
