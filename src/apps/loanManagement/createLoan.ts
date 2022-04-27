import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { createLoan } from '../../businessLogic/loan';
import { validate } from '../../utils/validation';
import { httpResponse } from '../../utils/helpers';
import { loanSchema } from '../../schemas/loan';
import axios from 'axios';

const OPENKVK_BASE_URL = process.env.OPENKVK_BASE_URL;
const OPENKVK_API_KEY = process.env.OPENKVK_API_KEY;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Processing event: ', event);

    // get company Id from query parameter
    let companyId: string | undefined;

    if (event.queryStringParameters) {
      companyId = event.queryStringParameters.companyId;
    }

    if (!companyId) {
      return httpResponse(
        {
          message: 'companyId query string parameter is required!',
        },
        400,
      );
    }

    const newLoan = JSON.parse(event.body);

    // validate loan payload
    const { valid, message } = validate(loanSchema, newLoan);

    if (!valid)
      return httpResponse(
        {
          message,
        },
        400,
      );

    // make a call to the company endpoint
    try {
      const { data } = await axios.get(`${OPENKVK_BASE_URL}/${companyId}`, {
        headers: {
          'ovio-api-key': OPENKVK_API_KEY,
        },
      });

      if (!data.actief) {
        return httpResponse(
          {
            message: `Company with id ${companyId} is not active`,
          },
          400,
        );
      }

      console.log('company api calll response', data);

      // add company response
      newLoan.company = data;
    } catch (e) {
      console.log('An error occured while updating the loan status', e);
      return httpResponse(
        {
          message: 'An error occured while updating the loan status',
        },
        400,
      );
    }

    const newItem = await createLoan(newLoan);

    return httpResponse(
      {
        newItem,
      },
      201,
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
