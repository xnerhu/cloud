import { config } from 'dotenv';

config();

export const SERVICE_PORT = parseInt(process.env.SERVICE_PORT as string);

export const API_KEY = process.env.API_KEY as string;
export const CACHE_TIME = parseInt(process.env.CACHE_TIME as string);

export const PATH_FILES_PUBLIC = process.env.PATH_FILES_PUBLIC as string;
export const PATH_FILES = process.env.PATH_FILES as string;

export const UPLOAD_MAX_FILE_SIZE = parseInt(
  process.env.UPLOAD_MAX_FILE_SIZE as string,
);
