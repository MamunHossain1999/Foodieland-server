/**
 * Custom Error Classes for Better Error Handling
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: any
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// 400 Bad Request
export class BadRequestError extends ApiError {
  constructor(message: string, errors?: any) {
    super(400, message, errors);
    this.name = "BadRequestError";
  }
}

// 401 Unauthorized
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

// 403 Forbidden
export class ForbiddenError extends ApiError {
  constructor(message = "Access Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

// 404 Not Found
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

// 409 Conflict
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message);
    this.name = "ConflictError";
  }
}

// 500 Internal Server Error
export class InternalServerError extends ApiError {
  constructor(message = "Internal server error") {
    super(500, message);
    this.name = "InternalServerError";
  }
}
