import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import 'source-map-support/register';
import { createLoan } from '../../businessLogic/loan';
import { validate } from '../../utils/validation';
import { httpResponse } from '../../utils/helpers';
import { loanSchema } from '../../schemas/loan';
import { Company } from '.././../models/loan';

const OPENKVK_BASE_URL = process.env.OPENKVK_BASE_URL;
const OPENKVK_API_KEY = process.env.OPENKVK_API_KEY;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
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
    const companyApiResponse = await callCompanyEndpoint(companyId);
    const { statusCode, message: responseMessage, data } = companyApiResponse;
    if (companyApiResponse.statusCode != 200) return httpResponse({ message: responseMessage }, statusCode);

    // add company response
    newLoan.company = data;

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

interface CompanyResponse {
  statusCode: number;
  message: string;
  data?: Company;
}

const callCompanyEndpoint = async (companyId: string): Promise<CompanyResponse> => {
  try {
    const { data } = await axios.get(`${OPENKVK_BASE_URL}/${companyId}`, {
      headers: {
        'ovio-api-key': OPENKVK_API_KEY,
      },
    });

    if (!data.actief)
      return {
        statusCode: 400,
        message: `Company with id ${companyId} is not active`,
      };

    return {
      statusCode: 200,
      message: 'Active company found',
      data,
    };
  } catch (e) {
    if (e.response && e.response.status === 404)
      return {
        statusCode: 404,
        message: `Company with id ${companyId} was not found`,
      };

    console.log('An error occured while updating the loan status', e);
    return {
      statusCode: 500,
      message: `An error occurred`,
    };
  }
};
