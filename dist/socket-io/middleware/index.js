"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const utils_2 = require("../../utils");
const socketAuth = async (socket, next) => {
    try {
        const { authorization } = socket.handshake.auth;
        const payload = (0, utils_1.verifyToken)(authorization);
        const userRepo = new DB_1.UserRepository();
        const user = await userRepo.getOne({ _id: payload._id });
        if (!user) {
            throw new utils_2.NotFoundException("User not found");
        }
        socket.data.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.socketAuth = socketAuth;
