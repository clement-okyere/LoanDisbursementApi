import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { createLoan } from '../../businessLogic/loan';
import { validate } from '../../utils/validation';
import { loanSchema } from '../../schemas/loan';
import axios from "axios";

const OPENKVK_BASE_URL = process.env.OPENKVK_BASE_URL;
const OPENKVK_API_KEY   = process.env.OPENKVK_API_KEY;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  // get company Id from query parameter
  let companyId: string | undefined ;

  if(event.queryStringParameters) {
    companyId = event.queryStringParameters.companyId;
  }

  if (!companyId) {
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

  const newLoan = JSON.parse(event.body);

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

    // make a call to the company endpoint 
    try {
      const {  data } = await axios.get(`${OPENKVK_BASE_URL}/${companyId}`,
      {
        headers: { 
          'ovio-api-key': OPENKVK_API_KEY
        }
      }
      );

      if(!data.actief) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Company with id ${companyId} is not active`,
          }),
        };
      }

      console.log('company api calll response', data);

      // add company response 
      newLoan.company = data;
    } catch (e) {
      console.log('An error occured while updating the loan status', e);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'An error occured while updating the loan status',
        }),
      };
    }
    

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
