// eslint-disable-next-line import/prefer-default-export
export function hello(event, context, cb) {
  cb(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({message: 'Hello world!'}),
  });
}
