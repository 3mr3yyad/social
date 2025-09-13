"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
class AuthService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() {
    }
    register = async (req, res, next) => {
        const registerDTO = req.body;
        const userExists = await this.userRepository.exists({ email: registerDTO.email });
        if (userExists) {
            throw new utils_1.ConflictException("User already exists");
        }
        const user = this.authFactoryService.register(registerDTO);
        const createdUser = await this.userRepository.create(user);
        await (0, utils_1.sendEmail)({
            to: registerDTO.email,
            subject: "Verify your email",
            html: `<h1>Verify your email</h1>
            <p>Your confirmation -otp- code is: <b><mark>${user.otp}</mark></b></p>
            <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
        });
        return res.status(201)
            .json({
            message: "User created successfully",
            success: true
        });
    };
    login = async (req, res, next) => {
        const loginDTO = req.body;
        const user = await this.userRepository.getOne({ email: loginDTO.email });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        const isPasswordMatched = (0, utils_1.compareHash)(loginDTO.password, user.password);
        if (!isPasswordMatched) {
            throw new utils_1.UnauthorizedException("Invalid credentials");
        }
        if (!user.isVerified) {
            throw new utils_1.UnauthorizedException("User is not verified");
        }
        return res.status(200)
            .json({
            message: "User logged in successfully",
            success: true
        });
    };
    verifyEmail = async (req, res, next) => {
        const verifyEmailDTO = req.body;
        const userExists = await this.userRepository.getOne({ email: verifyEmailDTO.email });
        if (!userExists) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (userExists.otp != verifyEmailDTO.otp) {
            throw new utils_1.UnauthorizedException("Invalid OTP");
        }
        if (userExists.otpExpiry > new Date()) {
            throw new utils_1.UnauthorizedException("OTP expired");
        }
        await this.userRepository.update({ email: verifyEmailDTO.email }, { isVerified: true });
        return res.status(200)
            .json({
            message: "User verified successfully",
            success: true,
        });
    };
}
exports.default = new AuthService();
