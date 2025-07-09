export * from './auth';
export * from './common';
export * from './company';
export * from './contact';
export * from './dashboard';
export * from './events';
export * from './import';
export * from './notes';
export * from './tags';
export * from './tasks';
export * from './tenant';
export * from './user';

type Ignore = 'createdAt' | 'updatedAt' | 'reminderDate';

export type PrismaRawResponse<T> = {
  [K in keyof T]: K extends Ignore
    ? Extract<T[K], string> extends never
      ? T[K] // No string in union — leave as-is
      : Extract<T[K], null> extends null
        ? Extract<T[K], undefined> extends undefined
          ? Date | null | undefined
          : Date | null
        : Extract<T[K], undefined> extends undefined
          ? Date | undefined
          : Date
    : T[K] extends (infer U)[]
      ? PrismaRawResponse<U>[]
      : T[K] extends object
        ? PrismaRawResponse<T[K]>
        : T[K];
};
