import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { UpdateEmailDTO, UpdateUserDTO } from "./userUpdate.dto";
import { generateExpiryTime, generateOTP, NotFoundException, sendEmail, UnauthorizedException } from "../../utils";

class UserService {
    private readonly userRepository = new UserRepository();
    constructor() {
    }

    public getProfile = async (req: Request, res: Response) => {
        const user = await this.userRepository.getOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Done",
            success: true,
            data: user
        });
    }

    public updateProfile = async (req: Request, res: Response) => {
        const updateUserDto: UpdateUserDTO = req.body;

        const user = await this.userRepository.getOne({ _id: req.params.id });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if ( user._id.toString() != req.params.id) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }
        
        const updatedUser = await this.userRepository.update({ _id: req.params.id }, updateUserDto);

        return res.status(201).json({
            message: "user updated successfully",
            success: true,
            data: updatedUser
        });
    }

    public updateEmail = async (req: Request, res: Response) => {
        const updateEmailDto : UpdateEmailDTO = {
            email: req.body.email,
            otp: generateOTP(),
            expiryTime: generateExpiryTime(5 * 60 * 1000)
        };
        
        const user = await this.userRepository.getOne({ _id: req.params.id });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if ( user._id.toString() != req.params.id) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }
        
        const updatedUser = await this.userRepository.update({ _id: req.params.id }, updateEmailDto);

        await sendEmail({
                            to: updateEmailDto.email,
                            subject: "Verify your email",
                            html: `<h1>Verify your new email</h1>
                            <p>Your confirmation -otp- code is: <b><mark>${updateEmailDto.otp}</mark></b></p>
                            <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
                        });

        return res.status(201).json({
            message: "email updated successfully, Please check your email for verification",
            success: true,
            data: updatedUser
        });
    }

    public updateTwoStepVerification = async (req: Request, res: Response) => {
        const user = await this.userRepository.getOne({ _id: req.params.id });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if ( user._id.toString() != req.params.id) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }
        
        const updatedUser = await this.userRepository.update({ _id: req.params.id }, { twoStepVerified: true });

        return res.status(201).json({
            message: "two step verification updated successfully",
            success: true,
            data: updatedUser
        });
    }
}

export default new UserService();
