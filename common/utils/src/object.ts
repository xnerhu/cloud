export const omitNull = <T extends Record<any, any>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null),
  ) as T;
};

export const isObjectEmpty = (obj: Record<any, any>) => {
  return Object.keys(obj).length === 0;
};

export const omitKeys = <T extends Record<any, any>>(
  obj: T,
  keys: string[],
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );
};
