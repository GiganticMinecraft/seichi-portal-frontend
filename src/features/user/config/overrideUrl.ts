import { Overrides } from '@/libs/overrideUrl';

export type UserApiKey = 'xbl' | 'xsts' | 'mcToken' | 'ownMc' | 'mcProfile';

// TODO: next.config.jsと重複しているのでどうにかする

export const overrides: Overrides<UserApiKey> = {
  xbl: {
    override: '/externalApi/xbl',
    original: 'https://user.auth.xboxlive.com/user/authenticate',
  },
  xsts: {
    override: '/externalApi/xsts',
    original: 'https://xsts.auth.xboxlive.com/xsts/authorize',
  },
  mcToken: {
    override: '/externalApi/mcToken',
    original:
      'https://api.minecraftservices.com/authentication/login_with_xbox',
  },
  ownMc: {
    override: '/externalApi/ownMc',
    original: 'https://api.minecraftservices.com/entitlements/mcstore',
  },
  mcProfile: {
    override: '/externalApi/mcProfile',
    original: 'https://api.minecraftservices.com/minecraft/profile',
  },
};
