import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';

import { PatchLoanRequest } from '../../requests/PatchLoanRequest';
import { updateLoan } from '../../businessLogic/loan';
import { validate } from '../../utils/validation';
import { patchedLoanSchema } from '../../schemas/loan';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // console.log('Processing event: ', event);

  const { loanId } = event.pathParameters;
  const payload: PatchLoanRequest = JSON.parse(event.body);

  console.log('payload', payload);

  // validate loan payload
  const { valid, message } = validate(patchedLoanSchema, payload);

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

  const { status } = payload;
  await updateLoan(loanId, 'status', status);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'loan status updated successfully',
    }),
  };
};
