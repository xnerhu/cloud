import { config } from 'dotenv';

config();

export const SERVICE_PORT = parseInt(process.env.SERVICE_PORT as string);

export const UPDATES_PUBLIC_PATH = process.env.UPDATES_PUBLIC_PATH as string;
