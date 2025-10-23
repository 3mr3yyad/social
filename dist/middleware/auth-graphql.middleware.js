"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedGraphql = void 0;
const utils_1 = require("../utils");
const DB_1 = require("../DB");
const isAuthenticatedGraphql = async (context) => {
    const token = context.token;
    const payload = (0, utils_1.verifyToken)(token);
    const userRepository = new DB_1.UserRepository();
    const user = await userRepository.exists({ _id: payload._id });
    if (!user) {
        throw new utils_1.NotFoundException("User not found");
    }
    if (payload.exp > Date.now()) {
        throw new utils_1.ForbiddenException("session expired");
    }
    context.user = user;
};
exports.isAuthenticatedGraphql = isAuthenticatedGraphql;
