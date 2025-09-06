"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
class BadRequestException extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends AppError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictException = ConflictException;
