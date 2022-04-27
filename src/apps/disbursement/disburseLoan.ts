import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { PatchLoanRequest } from '../../requests/PatchLoanRequest';
import { updateLoan } from '../../businessLogic/loan';
import { validate } from '../../utils/validation';
import { patchedLoanSchema } from '../../schemas/loan';
import { httpResponse } from '../../utils/helpers';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Processing event: ', event);
    const { loanId } = event.pathParameters;
    const payload: PatchLoanRequest = JSON.parse(event.body);

    // validate loan payload
    const { valid, message } = validate(patchedLoanSchema, payload);

    if (!valid)
      return httpResponse(
        {
          message,
        },
        400,
      );

    const { status } = payload;
    await updateLoan(loanId, 'status', status);

    return httpResponse(
      {
        message: 'updated loan status successfully',
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
