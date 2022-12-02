// NominalTyping
// See: https://speakerdeck.com/okunokentaro/harajukuts2?slide=39
// See: https://stackoverflow.com/questions/68057233/intersection-of-branded-types

// assertionをアロー関数で書くと、`Assertions require every name in the call target to be declared with an explicit type annotation.`というエラーが発生する
// ref. https://qiita.com/suin/items/e226c42a19e1ddd39d05

type MultiBranding<T> = {
  [Property in keyof T as `__brand_${string & Property}`]: T[Property];
};
export type MultiBrand<T, BrandT> = T & MultiBranding<BrandT>;
