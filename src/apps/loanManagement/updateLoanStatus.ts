import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { PatchLoanRequest } from '../../requests/PatchLoanRequest';
import { validate } from '../../utils/validation';
import { patchedLoanSchema } from '../../schemas/loan'
import  axios from "axios";


const DISBURSEMENT_API_BASE_URL = process.env.DISBURSEMENT_API_BASE_URL;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);

  const { id } = event.pathParameters;
  console.log('loanid', id);
  console.log('event.body', event.body);
  const payload: PatchLoanRequest = JSON.parse(event.body);

  console.log('payload', payload);

  // validate loan payload
  const { valid, message } = validate(patchedLoanSchema, payload);

  console.log('validate payload', valid);

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

  // make call to disbursement api
  try {
    const { status } = await axios.patch(`${DISBURSEMENT_API_BASE_URL}/disburse/${id}`, payload);
    if(status === 200)
    return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'updated loan status successfully',
        }),
      };
    console.log('result from disbursement api call')
  }
  catch(e) {
    console.log('An error occured while updating the loan status', e)
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

};
