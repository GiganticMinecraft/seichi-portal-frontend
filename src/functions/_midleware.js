export const onRequest = async ({ next }) => {
  const response = await next();
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://portal.seichi.click',
  );
  response.headers.set('Access-Control-Max-Age', 60 * 60 * 24);
  return response;
};
