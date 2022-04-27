/**
 * Function to clean up http responses
 * @param body response body
 * @param statusCode http status code
 * @param disableCors pass CORS headers if true
 * @param customHeaders
 * @returns
 */
export const httpResponse = (body: any, statusCode = 200, disableCors = false, customHeaders?: any) => {
  const stringifiedBody = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  const headers = {
    ...(customHeaders || {}),
  };

  if (!disableCors) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return {
    body: stringifiedBody,
    statusCode,
    headers,
  };
};
