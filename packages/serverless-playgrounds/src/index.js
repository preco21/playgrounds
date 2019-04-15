import 'source-map-support/register';
import {lambdaHandler, parseJSONSafe} from './utils/lambda';

// eslint-disable-next-line import/prefer-default-export
export const hello = lambdaHandler((event) => {
  const body = parseJSONSafe(event.body);
  return {body};
});
