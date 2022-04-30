import { httpResponse } from '../../src/utils/helpers';

describe('Helper Function Tests', function () {
  it('returns stringified body in response when object is passed as body', function () {
    const body = {
      message: 'test',
    };

    const response = httpResponse(body, 200);
    expect(typeof response.body).toBe('string');
  });

  it('returns expected status code', function () {
    const body = {
      message: 'test',
    };

    const response = httpResponse(body, 200);
    expect(response.statusCode).toBe(200);
  });

  it('returns expected cors headers when disabled cors is set to false', function () {
    const body = {
      message: 'test',
    };

    const response = httpResponse(body, 200);
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
  });

  it('does not return cors headers when disabled cors is set to true', function () {
    const body = {
      message: 'test',
    };

    const response = httpResponse(body, 200, true);
    expect(response.headers['Access-Control-Allow-Origin']).toBeUndefined();
  });

  it('returns response with customer headers when custom headers are passed', function () {
    const body = {
      message: 'test',
    };

    const header = {
      'x-api-key': 'xxxxxx',
    };

    const response = httpResponse(body, 200, true, header);
    expect(response.headers).toHaveProperty('x-api-key');
  });

  it('expects default status code to be 200 when no status code is passed', function () {
    const body = {
      message: 'test',
    };

    const response = httpResponse(body);
    expect(response.statusCode).toBe(200);
  });

  it('returns expected http response when all params are passed', function () {
    const body = {
      message: 'test',
    };

    const header = {
      'x-api-key': 'xxxxxx',
    };

    const expectedResponse = {
      body: JSON.stringify(body, null, 2),
      statusCode: 200,
      headers: {
        'x-api-key': 'xxxxxx',
      },
    };
    const response = httpResponse(body, 200, true, header);
    expect(response).toEqual(expectedResponse);
  });
});
