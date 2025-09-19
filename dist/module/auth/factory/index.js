"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const utils_1 = require("../../../utils");
const entity_1 = require("../entity");
class AuthFactoryService {
    async register(registerDto) {
        const user = new entity_1.User();
        user.fullName = registerDto.fullName;
        user.phoneNumber = registerDto.phoneNumber;
        user.email = registerDto.email;
        user.password = await (0, utils_1.generateHash)(registerDto.password);
        user.role = utils_1.SYS_ROLE.user;
        user.gender = registerDto.gender;
        user.userAgent = utils_1.USER_AGENT.local;
        user.otp = (0, utils_1.generateOTP)();
        user.otpExpiry = (0, utils_1.generateExpiryTime)(5 * 60 * 60 * 1000);
        user.cridentialsUpdatedAt = Date.now();
        user.isVerified = false;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
