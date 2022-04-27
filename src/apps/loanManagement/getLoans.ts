import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getAllLoans } from '../../businessLogic/loan';
import { httpResponse } from '../../utils/helpers';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Processing event: ', event);

    const loans = await getAllLoans();

    return httpResponse(
      {
        loans,
      },
      200,
    );
  } catch (e) {
    console.log('Error: ', e);
    return httpResponse(
      {
        message: 'An error occurred',
      },
      500,
    );
  }
};
