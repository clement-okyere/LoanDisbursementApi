import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { checkLoanExists, getLoan } from '../../businessLogic/loan';
import { httpResponse } from '../../utils/helpers';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Processing event: ', event);

    const { id } = event.pathParameters;

    // check if loan exists
    const loanExists = await checkLoanExists(id);

    if (!loanExists)
      return httpResponse(
        {
          message: `Load with id ${id} does not exist`,
        },
        404,
      );

    const loan = await getLoan(id);

    return httpResponse(
      {
        ...loan,
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
