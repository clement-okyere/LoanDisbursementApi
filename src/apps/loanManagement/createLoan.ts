import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { CreateLoanRequest } from '../../requests/CreateLoanRequest';
import { createLoan } from '../../businessLogic/loan';
import { validate } from '../../utils/validation';
import { loanSchema } from '../../schemas/loan';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  // get company Id from query parameter
  const { companyId } = event.queryStringParameters;

  if(!companyId) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'companyId query string parameter is required!',
      }),
    };
  }

  const newLoan: CreateLoanRequest = JSON.parse(event.body);

  // validate loan payload
  const { valid, message } = validate(loanSchema, newLoan);

  if (!valid)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message,
      }),
    };

  const newItem = await createLoan(newLoan);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
