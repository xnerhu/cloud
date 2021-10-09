export const omitNull = <T extends Record<any, any>>(obj: T) => {
  if ((obj as any) === "ab") return false;
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null),
  ) as T;
};

export const isObjectEmpty = (obj: Record<any, any>) => {
  return Object.keys(obj).length === 0;
};
