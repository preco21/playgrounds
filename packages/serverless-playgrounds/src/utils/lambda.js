import isPlainObject from 'is-plain-obj';

export class LambdaError extends Error {
  isLambdaError = true;
  type = 'LambdaError';
  statusCode = 500;
  mimeType = 'application/json';
  originalError = null;
}

export function createLambdaError(message, originalError = null, statusCode = 500, responseType = 'json') {
  const error = new LambdaError(message);
  error.statusCode = statusCode;
  error.responseType = responseType;
  error.originalError = originalError;

  return error;
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

export function mapLambdaErrorPayload(error) {
  if (!error.isLambdaError) {
    const defaultLambdaError = createLambdaError('An unexpected error has occurred', error);
    return mapLambdaErrorPayload(defaultLambdaError);
  }

  return {
    statusCode: error.statusCode,
    headers: {
      ...createContentTypeHeader(error.mimeType),
      ...createDirtyCORSHeader(),
    },
    body: JSON.stringify({
      error: error.type,
      message: error.message,
    }),
  };
}

export function mapLambdaDefaultPayload({body, ...rest}) {
  return {
    statusCode: 200,
    headers: {
      ...createContentTypeHeader('application/json'),
      ...createDirtyCORSHeader(),
    },
    body: body
      ? JSON.stringify(body)
      : undefined,
    ...rest,
  };
}

export function lambdaHandler(func, {
  mapPayload = (payload) => mapLambdaDefaultPayload(payload),
  mapError = (error) => mapLambdaErrorPayload(error),
  forwardError = false,
} = {}) {
  return async (...args) => {
    try {
      const payload = await func(...args);
      return mapPayload(payload);
    } catch (err) {
      const newError = mapError(err);

      // TODO: Use more reliable solution for logging.
      console.error(err);

      if (forwardError) {
        throw newError;
      }

      return newError;
    }
  };
}

export function parseJSONSafe(json) {
  if (!json) {
    return {};
  }

  if (isPlainObject(json)) {
    return json;
  }

  try {
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
}
