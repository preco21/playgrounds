import isPlainObject from 'is-plain-obj';

export class LambdaError extends Error {
  isLambdaError = true;
  type = 'LambdaError';
  statusCode = 500;
  mimeType = 'application/json';
  data = {};
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

export function mapLamdaDefaultPayload({body, ...rest}) {
  return {
    statusCode: 200,
    headers: {
      ...createContentTypeHeader('application/json'),
      ...createDirtyCORSHeader(),
    },
    body: JSON.stringify({
      data: body,
    }),
    ...rest,
  };
}

export function mapLambdaErrorToPayload(error) {
  if (!error.isLambdaError) {
    const defaultLambdaError = new LambdaError('An unexpected error has occurred');
    return mapLambdaErrorToPayload(defaultLambdaError);
  }

  return {
    statusCode: error.statusCode,
    headers: {
      ...createContentTypeHeader(error.mimeType),
      ...createDirtyCORSHeader(),
    },
    body: JSON.stringify({
      error: {
        type: error.type,
        message: error.message,
        ...error.data,
      },
    }),
  };
}

export function lambdaHandler(func, {
  mapPayload = (payload) => mapLamdaDefaultPayload(payload),
  mapError = (error) => mapLambdaErrorToPayload(error),
} = {}) {
  return async (...args) => {
    try {
      const payload = await func(...args);
      return mapPayload(payload);
    } catch (err) {
      // TODO: Use more reliable solution for logging.
      console.error(err);
      return mapError(err);
    }
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
