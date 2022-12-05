/* eslint-disable import/prefer-default-export */
import camelcaseKeys from 'camelcase-keys';
import Ky, { Options, NormalizedOptions } from 'ky';

const DEFAULT_API_OPTIONS: Options = {
  timeout: 7000,
  retry: 2,
  hooks: {
    afterResponse: [
      async (
        _request: Request,
        _options: NormalizedOptions,
        response: Response,
      ): Promise<Response> => {
        const body = new Blob(
          [JSON.stringify(camelcaseKeys(await response.json()), null, 2)],
          { type: 'application/json' },
        );
        const { headers, status, statusText } = response;
        const init = { headers, status, statusText };

        return new Response(body, init);
      },
    ],
  },
};

// TODO: replae ky with axios
export const ky = Ky.create(DEFAULT_API_OPTIONS);
