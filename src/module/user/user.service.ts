import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { UpdateEmailDTO, UpdatePasswordDTO, UpdateUserDTO } from "./userUpdate.dto";
import { compareHash, ForbiddenException, generateExpiryTime, generateHash, generateOTP, NotFoundException, sendEmail, UnauthorizedException } from "../../utils";

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

    public updatePassword = async (req: Request, res: Response) => {
        const updatePasswordDto : UpdatePasswordDTO = {
            oldPassword: await generateHash(req.body.oldPassword),
            newPassword: await generateHash(req.body.newPassword),
            confirmPassword: await generateHash(req.body.confirmPassword)
        };
        
        const user = await this.userRepository.getOne({ _id: req.params.id });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if ( user._id.toString() != req.params.id) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }

        const isPasswordMatched = await compareHash(updatePasswordDto.oldPassword, user.password);

        if (!isPasswordMatched) {
            throw new ForbiddenException("Invalid credentials");
        }

        if (updatePasswordDto.newPassword != updatePasswordDto.confirmPassword) {
            throw new ForbiddenException("Passwords do not match");
        }

        if (updatePasswordDto.newPassword == updatePasswordDto.oldPassword) {
            throw new ForbiddenException("New password cannot be the same as old password");
        }

        if(user.twoStepVerified){
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
        
        await this.userRepository.update({ _id: req.params.id }, { password: updatePasswordDto.newPassword });

        return res.status(201).json({
            message: "password updated successfully",
            success: true
        });
    }
}

export default new UserService();
