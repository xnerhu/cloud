export const getAdminUrl = (api: string, ...segments: string[]) => {
  return `${api}/admin/` + segments.join("/");
};

export const getAuthHeaders = (token: string) => {
  return {
    Authorization: token,
  };
};
