import { format } from 'util';

export interface AppErrorDetails {
  name: string;
  description?: string;
  code?: number;
  log?: boolean;
}

export class AppError extends Error {
  constructor(
    public readonly details: AppErrorDetails,
    public readonly isOperational: boolean,
  ) {
    super(details.description);

    this.name = details.name;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }

  public toString = () => {
    return `${this.details.name} [${this.details.code}]: ${this.message}, ${this.stack}`;
  };
}
export const createAppError =
  (details: AppErrorDetails, isOperational = true) =>
  (...args: any[]) => {
    return new AppError(
      !details.description
        ? details
        : { ...details, description: format(details.description, ...args) },
      isOperational,
    );
  };
