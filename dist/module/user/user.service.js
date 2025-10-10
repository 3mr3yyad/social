"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
class UserService {
    userRepository = new DB_1.UserRepository();
    constructor() {
    }
    getProfile = async (req, res) => {
        const user = await this.userRepository.getOne({ _id: req.params.id });
        if (!user || user.deletedAt) {
            throw new utils_1.NotFoundException("User not found");
        }
        return res.status(200).json({
            message: "Done",
            success: true,
            data: user
        });
    };
    updateProfile = async (req, res) => {
        const updateUserDto = req.body;
        const user = await this.userRepository.getOne({ _id: req.params.id });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != req.params.id) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        const updatedUser = await this.userRepository.update({ _id: req.params.id }, updateUserDto);
        return res.status(201).json({
            message: "user updated successfully",
            success: true,
            data: updatedUser
        });
    };
    updateEmail = async (req, res) => {
        const updateEmailDto = {
            email: req.body.email,
            otp: (0, utils_1.generateOTP)(),
            expiryTime: (0, utils_1.generateExpiryTime)(5 * 60 * 1000),
            isVerified: false
        };
        const user = await this.userRepository.getOne({ _id: req.params.id });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != req.params.id) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        const updatedUser = await this.userRepository.update({ _id: req.params.id }, updateEmailDto);
        await (0, utils_1.sendEmail)({
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
    };
    updateTwoStepVerification = async (req, res) => {
        const user = await this.userRepository.getOne({ _id: req.params.id });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != req.params.id) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        const updatedUser = await this.userRepository.update({ _id: req.params.id }, { twoStepVerified: true });
        return res.status(201).json({
            message: "two step verification updated successfully",
            success: true,
            data: updatedUser
        });
    };
    updatePassword = async (req, res) => {
        const updatePasswordDto = {
            oldPassword: await (0, utils_1.generateHash)(req.body.oldPassword),
            newPassword: await (0, utils_1.generateHash)(req.body.newPassword),
            confirmPassword: await (0, utils_1.generateHash)(req.body.confirmPassword)
        };
        const user = await this.userRepository.getOne({ _id: req.params.id });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != req.params.id) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        const isPasswordMatched = await (0, utils_1.compareHash)(updatePasswordDto.oldPassword, user.password);
        if (!isPasswordMatched) {
            throw new utils_1.ForbiddenException("Invalid credentials");
        }
        if (updatePasswordDto.newPassword != updatePasswordDto.confirmPassword) {
            throw new utils_1.ForbiddenException("Passwords do not match");
        }
        if (updatePasswordDto.newPassword == updatePasswordDto.oldPassword) {
            throw new utils_1.ForbiddenException("New password cannot be the same as old password");
        }
        if (user.twoStepVerified) {
            const otp = (0, utils_1.generateOTP)();
            const expiryTime = (0, utils_1.generateExpiryTime)(5 * 60 * 1000);
            await this.userRepository.update({ _id: user._id }, { otp, otpExpiry: expiryTime });
            await (0, utils_1.sendEmail)({
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
    };
    blockUser = async (req, res) => {
        const blockDTO = {
            user: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            blockedUserId: req.body.blockedUserId
        };
        const blockedUser = await this.userRepository.exists({ _id: blockDTO.blockedUserId });
        if (!blockedUser) {
            throw new utils_1.NotFoundException("User not found");
        }
        await this.userRepository.update({ _id: blockDTO.user }, { blockList: blockedUser._id });
        return res.status(200)
            .json({
            message: "User blocked successfully",
            success: true,
        });
    };
    unblockUser = async (req, res) => {
        const blockDTO = {
            user: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            blockedUserId: req.body.blockedUserId
        };
        const blockedUser = await this.userRepository.exists({ _id: blockDTO.blockedUserId });
        if (!blockedUser) {
            throw new utils_1.NotFoundException("User not found");
        }
        await this.userRepository.update({ _id: blockDTO.user }, { blockList: { $pull: blockedUser._id } });
        return res.status(200)
            .json({
            message: "User unblocked successfully",
            success: true,
        });
    };
    getBlockList = async (req, res) => {
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const blockList = await this.userRepository.exists({ _id: userId }, "blockList");
        if (!blockList) {
            return res.status(200)
                .json({
                message: "Block list is empty",
                success: true,
            });
        }
        return res.status(200)
            .json({
            message: "Block list fetched successfully",
            success: true,
            data: blockList
        });
    };
}
exports.default = new UserService();
