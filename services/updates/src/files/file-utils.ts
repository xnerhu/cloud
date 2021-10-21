export const getUpdateDownloadUrl = (filename: string, publicPath: string) => {
  return `${publicPath}/${filename}`;
};

export interface GetDownloadFilenameOptions {
  os: string;
  architecture: string;
  channel: string;
}

export const getDownloadFilename = (data: GetDownloadFilenameOptions) => {
  return `${data.os}-${data.architecture}_${data}`;
};

const EXTENIONS_OS = {
  windows: "exe",
};
