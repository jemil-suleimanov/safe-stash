export class AppError extends Error {
    public readonly statusCode:       number;
    public readonly underlyingError?: unknown;

    constructor(
        message: string,
        statusCode: number = 500,
        underlyingError?: unknown,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.underlyingError = underlyingError;

        Object.setPrototypeOf(this, AppError.prototype);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }

        this.name = 'AppError';
    }
}

export class DatabaseError extends AppError {
    constructor(message: string = 'A database error occurred.', underlyingError?: unknown) {
        super(message, 500, underlyingError);
        this.name = 'DatabaseError';
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found.', underlyingError: unknown) {
        super(message, 404, underlyingError);
        this.name = 'notFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Invalid input data.', underlyingError: unknown) {
        super(message, 400, underlyingError);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
