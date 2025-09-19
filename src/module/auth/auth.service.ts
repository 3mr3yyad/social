import type { Request, Response } from "express";
import { LoginDto, RegisterDto, VerifyEmailDTO } from "./auth.dto";
import { ConflictException, NotFoundException, UnauthorizedException, compareHash } from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { authProvider } from "./provider/auth.provider";

class AuthService {
    private userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();
    constructor() {

    }
    register = async (req: Request, res: Response) => {
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

    login = async (req: Request, res: Response) => {
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

    verifyEmail = async (req: Request, res: Response) => {
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
}

export default new AuthService();
