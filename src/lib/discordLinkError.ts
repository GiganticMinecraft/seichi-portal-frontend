/**
 * Discord 連携の失敗を `/users/me` に伝えるためのクエリパラメータ。
 *
 * `/api/discord` (OAuth コールバック) が、利用者の操作で解決できる失敗のときだけ
 * この値を付けて `/users/me` へ戻す。画面側は許可リストにある値だけを文言に変換し、
 * URL の文字列をそのまま描画しない。
 */
export const DISCORD_LINK_ERROR_QUERY = 'discordLinkError';

const DISCORD_LINK_ERROR_MESSAGES = {
  'already-linked':
    'この Discord アカウントはすでに別のユーザーに連携されています。別のアカウントで連携し直してください。',
} as const satisfies Record<string, string>;

export type DiscordLinkError = keyof typeof DISCORD_LINK_ERROR_MESSAGES;

export const DISCORD_LINK_ERROR_ALREADY_LINKED: DiscordLinkError =
  'already-linked';

const isDiscordLinkError = (value: string): value is DiscordLinkError =>
  Object.hasOwn(DISCORD_LINK_ERROR_MESSAGES, value);

/** クエリパラメータの値を表示用の文言に変換する。未知の値は `undefined`。 */
export const resolveDiscordLinkErrorMessage = (
  value: string | string[] | undefined
): string | undefined => {
  const single = Array.isArray(value) ? value[0] : value;

  return single !== undefined && isDiscordLinkError(single)
    ? DISCORD_LINK_ERROR_MESSAGES[single]
    : undefined;
};
