export * from "./result";

export type StringLiteral<T> = T extends string
    ? string extends T
    ? never
    : T
    : never;

declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B extends string> = B extends StringLiteral<B>
    ? T & Brand<B>
    : never;

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
export type IsAny<T> = IfAny<T, true, never>;

export const exclude = <T extends object, Key extends keyof T>(
    obj: T,
    keys: Key[]
): Omit<T, Key> => {
    for (const key of keys) {
        delete obj[key];
    }
    return obj;
};

export const toList = <T extends object, Key extends keyof T>(
    obj: T,
    keys: Key[]
): T[Key][] => {
    return Object.entries(obj)
        .filter((e) => e[0] in keys)
        .map((e) => e[1]);
};
