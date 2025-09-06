export class AppError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

export class BadRequestException extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedException extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenException extends AppError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class NotFoundException extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ConflictException extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}