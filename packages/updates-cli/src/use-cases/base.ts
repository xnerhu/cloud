export type UseCaseOptions<T = Record<string, any>> = T & {
  api: string;
  token: string;
};
