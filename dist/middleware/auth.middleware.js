"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const utils_1 = require("../utils");
const DB_1 = require("../DB");
const isAuthenticated = () => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        const payload = (0, utils_1.verifyToken)(token);
        const userRepository = new DB_1.UserRepository();
        const user = await userRepository.exists({ _id: payload._id });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (payload.exp > Date.now()) {
            throw new utils_1.ForbiddenException("session expired");
        }
        // TODO: check user agent, logged out from all, deleted
        req.user = user;
        next();
    };
};
exports.isAuthenticated = isAuthenticated;
