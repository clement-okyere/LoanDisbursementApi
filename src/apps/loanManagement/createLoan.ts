import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { CreateLoanRequest } from '../../requests/CreateLoanRequest';
import { createLoan } from '../../businessLogic/loans';
import { validate } from '../../utils/validation';
import loanSchema from '../../schemas/loan';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  const newLoan: CreateLoanRequest = JSON.parse(event.body);

  // validate loan payload

  const { success, message } = validate(loanSchema, newLoan);

  if (!success)
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
