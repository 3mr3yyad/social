import type { Request, Response } from "express";
import {  LoginDto, RegisterDto, VerifyEmailDTO } from "./auth.dto";
import { ConflictException, ForbiddenException, NotFoundException, compareHash, generateExpiryTime, generateOTP, sendEmail } from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { authProvider } from "./provider/auth.provider";
import { generateToken } from "../../utils/token";

class AuthService {
    private userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();
    constructor() {

    }
    public register = async (req: Request, res: Response) => {
        const registerDTO: RegisterDto = req.body;

        const userExists = await this.userRepository.exists({ email: registerDTO.email });
        if (userExists) {
            throw new ConflictException("User already exists");
        }

        const user = await this.authFactoryService.register(registerDTO);

        const createdUser = await this.userRepository.create(user);

        return res.status(201)
            .json({
                message: "User created successfully",
                success: true,
                data: createdUser.id
            });
    }

    public login = async (req: Request, res: Response) => {
        const loginDTO: LoginDto = req.body;

        const user = await this.userRepository.exists({ email: loginDTO.email });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (!user.isVerified) {
            throw new ForbiddenException("User is not verified");
        }

        const isPasswordMatched = await compareHash(loginDTO.password, user.password);

        if (!isPasswordMatched) {
            throw new ForbiddenException("Invalid credentials");
        }

        if (user.twoStepVerified) {
            const otp = generateOTP();
            const expiryTime = generateExpiryTime(5 * 60 * 1000);

            await this.userRepository.update({ _id: user._id }, { otp, otpExpiry: expiryTime });

            await sendEmail({
                to: user.email,
                subject: "Two step verification",
                text: `Your two step verification code is ${otp}`
            });

            return res.status(200)
                .json({
                    message: "check your email for two step verification",
                    success: true
                });
        }

        const accessToken = generateToken({ payload: { _id: user._id, role: user.role, fullName: user.fullName, gender: user.gender} });

        return res.status(200)
            .json({
                message: "User logged in successfully",
                success: true,
                data: accessToken
            });
    }

    public verifyEmail = async (req: Request, res: Response) => {
        const verifyEmailDTO: VerifyEmailDTO = req.body;

        await authProvider.checkOTP(verifyEmailDTO);

        await this.userRepository.update(
            { email: verifyEmailDTO.email },
            { isVerified: true, $unset: { otp: "", otpExpiry: "" } }
        );

        return res.status(200)
            .json({
                message: "User verified successfully",
                success: true,
            });
    }
    public twoStepVerification = async (req: Request, res: Response) => {
        const twoStepVerificationDTO: VerifyEmailDTO = req.body;

        await authProvider.checkOTP(twoStepVerificationDTO);

        const user = await this.userRepository.exists({ email: twoStepVerificationDTO.email });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        await this.userRepository.update(
            { email: twoStepVerificationDTO.email },
            { twoStepVerified: true, $unset: { otp: "", otpExpiry: "" } }
        );

        const accessToken = generateToken({ payload: { _id: user._id, role: user.role, fullName: user.fullName, gender: user.gender} });

        return res.status(200)
            .json({
                message: "User two step verified successfully",
                success: true,
                data: accessToken
            });
    }
}

export default new AuthService();
