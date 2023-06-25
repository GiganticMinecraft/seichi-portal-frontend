const maxAge = 60 * 60 * 24;

export const onRequest: PagesFunction = async ({ next }) => {
  const response = await next();
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://portal.seichi.click',
  );
  response.headers.set('Access-Control-Max-Age', maxAge.toString());

  return response;
};
