"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const enums_1 = require("../../../utils/common/enums");
const hash_1 = require("../../../utils/hash");
const OTP_1 = require("../../../utils/OTP");
const entity_1 = require("../entity");
class AuthFactoryService {
    register(registerDto) {
        const user = new entity_1.User();
        user.fullName = registerDto.fullName;
        user.phoneNumber = registerDto.phoneNumber;
        user.email = registerDto.email;
        user.password = (0, hash_1.generateHash)(registerDto.password);
        user.role = enums_1.SYS_ROLE.user;
        user.gender = registerDto.gender;
        user.userAgent = enums_1.USER_AGENT.local;
        user.otp = (0, OTP_1.generateOTP)();
        user.otpExpiry = (0, OTP_1.generateExpiryTime)(5 * 60 * 60 * 1000);
        user.cridentialsUpdatedAt = Date.now();
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
