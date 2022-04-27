import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { checkLoanExists, getLoan } from '../../businessLogic/loan';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  const { id } = event.pathParameters;

  // check if loan exists
  const loanExists = await checkLoanExists(id);

  if (!loanExists)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: `Load with id ${id} does not exist`,
      }),
    };

  const loan = await getLoan(id);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      ...loan,
    }),
  };
};
