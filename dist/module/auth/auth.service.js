"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const auth_provider_1 = require("./provider/auth.provider");
const token_1 = require("../../utils/token");
class AuthService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() {
    }
    register = async (req, res) => {
        const registerDTO = req.body;
        const userExists = await this.userRepository.exists({ email: registerDTO.email });
        if (userExists) {
            throw new utils_1.ConflictException("User already exists");
        }
        const user = await this.authFactoryService.register(registerDTO);
        const createdUser = await this.userRepository.create(user);
        return res.status(201)
            .json({
            message: "User created successfully",
            success: true,
            data: createdUser.id
        });
    };
    login = async (req, res) => {
        const loginDTO = req.body;
        const user = await this.userRepository.exists({ email: loginDTO.email });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (!user.isVerified) {
            throw new utils_1.ForbiddenException("User is not verified");
        }
        const isPasswordMatched = await (0, utils_1.compareHash)(loginDTO.password, user.password);
        if (!isPasswordMatched) {
            throw new utils_1.ForbiddenException("Invalid credentials");
        }
        const accessToken = (0, token_1.generateToken)({ payload: { _id: user._id, role: user.role, fullName: user.fullName, gender: user.gender } });
        return res.status(200)
            .json({
            message: "User logged in successfully",
            success: true,
            data: accessToken
        });
    };
    verifyEmail = async (req, res) => {
        const verifyEmailDTO = req.body;
        await auth_provider_1.authProvider.checkOTP(verifyEmailDTO);
        await this.userRepository.update({ email: verifyEmailDTO.email }, { isVerified: true, $unset: { otp: "", otpExpiry: "" } });
        return res.status(200)
            .json({
            message: "User verified successfully",
            success: true,
        });
    };
}
exports.default = new AuthService();
