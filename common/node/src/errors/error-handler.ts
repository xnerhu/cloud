import { AppError } from "./app-error";

export const handleError = (err: Error | AppError) => {
  if (!isErrorOperational(err)) {
    console.error(`Exiting process due to error: ${err}`);
    process.exit(1);
  }

  return true;
};

export const isErrorOperational = (err: Error | AppError) => {
  if (err instanceof AppError) {
    return err.isOperational;
  }
  return false;
};
