export enum ErrorType {
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorType,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
  }

  toString() {
    return this.message;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.BAD_REQUEST, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, details?: any) {
    super(`${entity} not found`, ErrorType.NOT_FOUND, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.UNAUTHORIZED, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.FORBIDDEN, 403, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, ErrorType.CONFLICT, 409, details);
  }
}
