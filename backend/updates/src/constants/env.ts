import { config } from 'dotenv';

config();

export const SERVICE_PORT = parseInt(process.env.SERVICE_PORT as string);

export const UPDATES_PUBLIC_PATH = process.env.UPDATES_PUBLIC_PATH as string;

export const CACHE_TIME = parseInt(process.env.CACHE_TIME as string);

export const PATH_RELEASES_PUBLIC = process.env.PATH_RELEASES_PUBLIC as string;
