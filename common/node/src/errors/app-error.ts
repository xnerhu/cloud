import { format } from "util";

export interface AppErrorDetails {
  name: string;
  description?: string;
  code?: number;
}

const DEFAULT_DETAILS: Partial<AppErrorDetails> = { code: 400 };

export class AppError extends Error {
  public readonly details: AppErrorDetails;

  constructor(
    details: AppErrorDetails,
    public readonly isOperational: boolean,
  ) {
    super(details.description);

    this.details = { ...DEFAULT_DETAILS, ...details };
    this.name = details.name;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }

  public toString = () => {
    return `${this.details.name} [${this.details.code}]: ${this.message}, ${this.stack}`;
  };
}

export const createAppError =
  (details: AppErrorDetails, isOperational = false) =>
  (...args: any[]) => {
    return new AppError(
      !details.description
        ? details
        : { ...details, description: format(details.description, ...args) },
      isOperational,
    );
  };
