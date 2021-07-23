export class AppError extends Error {
  public readonly isOperational: boolean;

  constructor(description: string, isOperational = true) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
