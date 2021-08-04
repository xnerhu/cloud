import { promises as fs } from 'fs';

import { createAppError } from '../errors';

const FolderNotFound = createAppError(
  {
    name: 'FOLDER_NOT_FOUND',
    description: `Folder %s not found`,
  },
  false,
);

const IncorrectFileFormat = createAppError({
  name: 'INCORRECT_FILE_FORMAT',
  description: `Incorrect file format of %s`,
  code: 400,
});

export const pathExists = async (path: string) => {
  try {
    await fs.stat(path);
  } catch (err) {
    return false;
  }

  return true;
};

export const ensurePath = async (path: string) => {
  if (!(await pathExists(path))) {
    await fs.mkdir(path, { recursive: true });
  }
};

export const ensureFile = async (dst: string, src: string) => {
  if (!(await pathExists(dst))) {
    await fs.copyFile(src, dst);
  }
};

export const getFileExtension = (path: string) => {
  return path.split('.').slice(-1)[0].toLowerCase();
};

export const ensureFileFormat = (path: string, ext: string) => {
  if (!path.toLowerCase().endsWith(ext)) throw IncorrectFileFormat(path);
};

export const ensureFolder = async (path: string) => {
  if (!(await pathExists(path))) throw FolderNotFound(path);
};
