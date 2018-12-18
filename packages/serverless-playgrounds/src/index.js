import {
  lambdaHandler,
  parseJSONSafe,
  createContentTypeHeader,
  createDirtyCORSHeader,
} from './utils/common';

// eslint-disable-next-line import/prefer-default-export
export const hello = lambdaHandler((event) => {
  const body = parseJSONSafe(event.body);

  return {
    statusCode: 200,
    headers: {
      ...createContentTypeHeader('application/json'),
      ...createDirtyCORSHeader(),
    },
    body: JSON.stringify({message: body}),
  };
});
