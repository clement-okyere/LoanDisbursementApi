import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import 'source-map-support/register';
import { PatchLoanRequest } from '../../requests/PatchLoanRequest';
import { validate } from '../../utils/validation';
import { patchedLoanSchema } from '../../schemas/loan';
import { httpResponse } from '../../utils/helpers';

const DISBURSEMENT_API_BASE_URL = process.env.DISBURSEMENT_API_BASE_URL;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters;
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

    // make call to disbursement api
    try {
      const { status } = await axios.patch(`${DISBURSEMENT_API_BASE_URL}/disburse/${id}`, payload);
      if (status === 200)
        return httpResponse(
          {
            message: 'updated loan status successfully',
          },
          201,
        );
    } catch (e) {
      return httpResponse(
        {
          message: 'An error occured while updating the loan status',
        },
        400,
      );
    }
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
