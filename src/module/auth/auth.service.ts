import type { NextFunction, Request, Response } from "express";
import { LoginDto, RegisterDto, VerifyEmailDto } from "./auth.dto";
import { ConflictException, NotFoundException, UnauthorizedException } from "../../utils/error";
import { UserRepository } from "../../DB/model/user/user.repository";
import { AuthFactoryService } from "./factory";
import { compareHash } from "../../utils/hash";
import { sendEmail } from "../../utils/email";

class AuthService {
    private userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();
    constructor() {

    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        const registerDTO: RegisterDto = req.body;

        const userExists = await this.userRepository.exists({ email: registerDTO.email });
        if (userExists) {
            throw new ConflictException("User already exists");
        }

        const user = this.authFactoryService.register(registerDTO);

        const createdUser = await this.userRepository.create(user);

        await sendEmail({
            to: registerDTO.email,
            subject: "Verify your email",
            html: `<h1>Verify your email</h1>
            <p>Your confirmation -otp- code is: <b><mark>${user.otp}</mark></b></p>
            <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
        })


        return res.status(201)
            .json({
                message: "User created successfully",
                success: true
            });
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const loginDTO: LoginDto = req.body;

        const user = await this.userRepository.getOne({ email: loginDTO.email });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isPasswordMatched = compareHash(loginDTO.password, user.password);

        if (!isPasswordMatched) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!user.isVerified) {
            throw new UnauthorizedException("User is not verified");
        }

        return res.status(200)
            .json({
                message: "User logged in successfully",
                success: true
            });
    }

    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        const verifyEmailDTO: VerifyEmailDto = req.body;

        const userExists = await this.userRepository.getOne({ email: verifyEmailDTO.email });

        if(!userExists){
            throw new NotFoundException("User not found");
        }

        if(userExists.otp != verifyEmailDTO.otp){
            throw new UnauthorizedException("Invalid OTP");
        }

        if((userExists.otpExpiry as Date) > new Date()){
            throw new UnauthorizedException("OTP expired");
        }

        await this.userRepository.update({ email: verifyEmailDTO.email }, { isVerified: true });

        return res.status(200)
            .json({
                message: "User verified successfully",
                success: true,
            });

    }
}

export default new AuthService();
