'use server';

import { createErr, createOk } from 'option-t/esm/PlainResult';
import { andThenAsync } from 'option-t/esm/PlainResult/namespace';
import {
  xboxLiveServiceTokenResponseSchema,
  minecraftAccessTokenResponseSchema,
  minecraftProfileResponseSchema,
} from '../types/loginSchema';

// TODO: エラーメッセージを分類する

export const acquireXboxLiveToken = async (token: string) => {
  const URL = 'https://user.auth.xboxlive.com/user/authenticate';

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Properties: {
        AuthMethod: 'RPS',
        SiteName: 'user.auth.xboxlive.com',
        RpsTicket: `d=${token}`,
      },
      RelyingParty: 'http://auth.xboxlive.com',
      TokenType: 'JWT',
    }),
  })
    .then((r) => {
      if (!r.ok) {
        return createErr(new Error(`${r.status}: ${r.statusText}`));
      }

      return createOk(r);
    })
    .catch((e: Error) => createErr(e));

  return andThenAsync(response, async (r) => {
    const result = xboxLiveServiceTokenResponseSchema.safeParse(await r.json());
    if (!result.success) {
      return createErr(result.error);
    }

    return createOk({
      token: result.data.Token,
      userHash: result.data.DisplayClaims.xui[0].uhs,
    });
  });
};

export const acquireXboxServiceSecurityToken = async ({
  token,
}: {
  token: string;
}) => {
  const URL = 'https://xsts.auth.xboxlive.com/xsts/authorize';

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Properties: {
        SandboxId: 'RETAIL',
        UserTokens: [token],
      },
      RelyingParty: 'rp://api.minecraftservices.com/',
      TokenType: 'JWT',
    }),
  })
    .then((r) => {
      if (!r.ok) {
        return createErr(new Error(`${r.status}: ${r.statusText}`));
      }

      return createOk(r);
    })
    .catch((e: Error) => createErr(e));

  return andThenAsync(response, async (r) => {
    const result = xboxLiveServiceTokenResponseSchema.safeParse(await r.json());
    if (!result.success) {
      return createErr(result.error);
    }

    return createOk({
      token: result.data.Token,
      userHash: result.data.DisplayClaims.xui[0].uhs,
    });
  });
};

export const acquireMinecraftAccessToken = async ({
  token,
  userHash,
}: {
  token: string;
  userHash: string;
}) => {
  const URL =
    'https://api.minecraftservices.com/authentication/login_with_xbox';

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identityToken: `XBL3.0 x=${userHash};${token}`,
    }),
  })
    .then((r) => {
      if (!r.ok) {
        return createErr(new Error(`${r.status}: ${r.statusText}`));
      }

      return createOk(r);
    })
    .catch((e: Error) => createErr(e));

  return andThenAsync(response, async (r) => {
    const result = minecraftAccessTokenResponseSchema.safeParse(await r.json());
    if (!result.success) {
      return createErr(result.error);
    }

    return createOk({
      token: result.data.access_token,
      expires: result.data.expires_in,
    });
  });
};

export const acquireMinecraftProfile = async ({ token }: { token: string }) => {
  const URL = 'https://api.minecraftservices.com/minecraft/profile';

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((r) => {
      if (!r.ok) {
        return createErr(new Error(`${r.status}: ${r.statusText}`));
      }

      return createOk(r);
    })
    .catch((e: Error) => createErr(e));

  return andThenAsync(response, async (r) => {
    const result = minecraftProfileResponseSchema.safeParse(await r.json());
    if (!result.success) {
      return createErr(result.error);
    }

    return createOk(result.data);
  });
};
