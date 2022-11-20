/**
 * Nominal Typing
 * See: https://speakerdeck.com/okunokentaro/harajukuts2?slide=39
 */
/**
 * assertionをアロー関数で書くと、`Assertions require every name in the call target to be declared with an explicit type annotation.`というエラーが発生する
 * ref. https://qiita.com/suin/items/e226c42a19e1ddd39d05
 */

export type Nominal<T, U extends string> = T & { __brand: U };
