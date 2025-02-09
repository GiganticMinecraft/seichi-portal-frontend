/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_MS_APP_CLIENT_ID: string;
    readonly NEXT_PUBLIC_MS_APP_REDIRECT_URL: string;
    readonly NEXT_PUBLIC_BACKEND_SERVER_URL: string;
    readonly NEXT_PUBLIC_DEBUG_MODE: string;
    readonly NEXT_PUBLIC_DISCORD_CLIENT_ID: string;
    readonly NEXT_PUBLIC_DISCORD_CLIENT_SECRET: string;
    readonly NEXT_PUBLIC_DISCORD_REDIRECT_URI: string;
  }
}
