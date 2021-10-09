export const omitNull = <T extends Record<any, any>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null),
  ) as T;
};
// warawrawr
export const isObjectEmpty = (obj: Record<any, any>) => {
  return Object.keys(obj).length === 0;
};
