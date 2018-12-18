import isPlainObject from 'is-plain-obj';

export class LambdaError extends Error {
  isLambdaError = true;
}

export function createLambdaError(name, describe, statusCode = 500, responseType = 'json') {
  const error = new LambdaError(name);
  error.describe = describe;
  error.statusCode = statusCode;
  error.responseType = responseType;

  return error;
}

export function composeLambdaErrorToPayload(error) {
  if (error.isLambdaError) {
    return {
      statusCode: error.statusCode,
      headers: {
        ...createContentTypeHeader(error.responseType === 'json' ? 'application/json' : 'text/plain'),
        ...createDirtyCORSHeader(),
      },
      body: error.responseType === 'json'
        ? JSON.stringify({
          error: {
            type: error.message,
            ...error.describe,
          },
        })
        : error.message,
    };
  }

  return {
    statusCode: 500,
    headers: {
      ...createContentTypeHeader('application/json'),
      ...createDirtyCORSHeader(),
    },
    body: JSON.stringify({message: 'An unexpected error has occurred'}),
  };
}

export function lambdaHandler(func, {
  mapPayload = (payload) => payload,
  mapError = (error) => composeLambdaErrorToPayload(error),
} = {}) {
  return async (...args) => {
    try {
      const payload = await func(...args);
      return mapPayload(payload);
    } catch (err) {
      console.error(err);
      return mapError(err);
    }
  };
}

export function createContentTypeHeader(type) {
  return {
    'Content-Type': type,
  };
}

export function createDirtyCORSHeader() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  };
}

export function parseJSONSafe(json) {
  if (isPlainObject(json)) {
    return json;
  }

  try {
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
}
