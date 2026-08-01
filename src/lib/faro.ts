import type { Faro } from '@grafana/faro-web-sdk';

let faroInstance: Faro | undefined;

// faro 本体は instrumentation-client.ts で dynamic import され専用チャンクに
// 分離されるため、利用側はこのモジュール経由で参照する（type import のみで
// バンドルに faro が入らない）。初期化前の呼び出しは no-op。
export const setFaro = (faro: Faro) => {
  faroInstance = faro;
};

export const pushError = (error: Error) => {
  faroInstance?.api.pushError(error);
};
