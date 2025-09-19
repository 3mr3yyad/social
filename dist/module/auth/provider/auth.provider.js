"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProvider = void 0;
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
exports.authProvider = {
    async checkOTP(verifyEmailDTO) {
        const userRepository = new DB_1.UserRepository();
        const userExists = await userRepository.exists({
            email: verifyEmailDTO.email
        });
        if (!userExists) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (userExists.otp != verifyEmailDTO.otp) {
            throw new utils_1.UnauthorizedException("Invalid OTP");
        }
        if (userExists.otpExpiry < new Date()) {
            throw new utils_1.UnauthorizedException("OTP expired");
        }
    },
    async updateUser(filter, update) {
        const userRepository = new DB_1.UserRepository();
        await userRepository.update(filter, update);
    }
};
