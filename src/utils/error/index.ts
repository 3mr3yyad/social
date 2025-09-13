export class AppError extends Error {
    constructor(message: string,
        public statusCode: number,
        public errorDetails?: Record<string, any>) {
        super(message);
    }
}

export class BadRequestException extends AppError {
    constructor(message: string, errorDetails?: Record<string, any>) {
        super(message, 400, errorDetails);
    }
}

export class UnauthorizedException extends AppError {
    constructor(message: string, errorDetails?: Record<string, any>) {
        super(message, 401, errorDetails);
    }
}

export class ForbiddenException extends AppError {
    constructor(message: string, errorDetails?: Record<string, any>) {
        super(message, 403, errorDetails);
    }
}

export class NotFoundException extends AppError {
    constructor(message: string, errorDetails?: Record<string, any>) {
        super(message, 404, errorDetails);
    }
}

export class ConflictException extends AppError {
    constructor(message: string, errorDetails?: Record<string, any>) {
        super(message, 409, errorDetails);
    }
}