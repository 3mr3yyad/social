"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
class UserService {
    userRepository = new DB_1.UserRepository();
    constructor() {
    }
    getProfile = async (req, res) => {
        const user = await this.userRepository.getOne({ _id: req.params.id }, { id: 1, fullName: 1, fristName: 1, lastName: 1, profilePicture: 1, email: 1, role: 1, gender: 1, createdAt: 1 }, {});
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
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const user = await this.userRepository.getOne({ _id: userId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != userId.toString()) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        const updatedUser = await this.userRepository.update({ _id: userId }, updateUserDto);
        return res.status(201).json({
            message: "user updated successfully",
            success: true,
            data: updatedUser
        });
    };
    updateEmailVerification = async (req, res) => {
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const user = await this.userRepository.getOne({ _id: userId });
        const newEmail = req.body.email;
        const emailExists = await this.userRepository.getOne({ email: newEmail });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != userId.toString()) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        if (user.email == newEmail) {
            throw new utils_1.ForbiddenException("New email cannot be the same as old email");
        }
        if (emailExists) {
            throw new utils_1.ForbiddenException("Email already exists");
        }
        const otp = (0, utils_1.generateOTP)();
        const expiryTime = (0, utils_1.generateExpiryTime)(5 * 60 * 1000);
        await this.userRepository.update({ _id: user._id }, { otp, otpExpiry: expiryTime });
        await (0, utils_1.sendEmail)({
            to: user.email,
            subject: "Email verification",
            html: `<h1>Email verification</h1>
            <p>Your confirmation -otp- code is: <b><mark>${otp}</mark></b></p>
            <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
        });
        return res.status(200)
            .json({
            message: "check your email for OTP",
            success: true
        });
    };
    updateEmail = async (req, res) => {
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const user = await this.userRepository.getOne({ _id: userId });
        const otp = await this.userRepository.getOne({ _id: userId }, { otp: 1 }, {});
        const expiryTime = await this.userRepository.getOne({ _id: userId }, { otpExpiry: 1 }, {});
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        const updateEmailDto = {
            email: req.body.email,
            otp: otp.otp,
            expiryTime: expiryTime.otpExpiry,
            isVerified: true
        };
        if (user._id.toString() != userId.toString()) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        if (!otp) {
            throw new utils_1.NotFoundException("OTP not found");
        }
        if (!expiryTime.otpExpiry) {
            throw new utils_1.NotFoundException("OTP not found");
        }
        if (otp.otp != updateEmailDto.otp) {
            throw new utils_1.ForbiddenException("Invalid OTP");
        }
        if (Date.now() > new Date(expiryTime.otpExpiry).getTime()) {
            throw new utils_1.ForbiddenException("OTP expired");
        }
        const updatedUser = await this.userRepository.update({ _id: userId }, updateEmailDto);
        return res.status(201).json({
            message: "email updated successfully",
            success: true,
            data: updatedUser
        });
    };
    updateTwoStepVerification = async (req, res) => {
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const user = await this.userRepository.getOne({ _id: userId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != userId.toString()) {
            throw new utils_1.UnauthorizedException("You are not authorized to update this user");
        }
        const updatedUser = await this.userRepository.update({ _id: userId }, { twoStepVerified: true });
        return res.status(201).json({
            message: "two step verification updated successfully",
            success: true,
            data: updatedUser
        });
    };
    updatePassword = async (req, res) => {
        const updatePasswordDto = {
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
            confirmPassword: req.body.confirmPassword
        };
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const user = await this.userRepository.getOne({ _id: userId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user._id.toString() != userId.toString()) {
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
        await this.userRepository.update({ _id: userId }, { password: (0, utils_1.generateHash)(updatePasswordDto.newPassword) });
        return res.status(201).json({
            message: "password updated successfully",
            success: true
        });
    };
    blockUser = async (req, res) => {
        const blockDTO = {
            currentUserId: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            recieverUserId: req.params.id
        };
        const currentUserId = await this.userRepository.exists({ _id: blockDTO.currentUserId });
        const blockedUser = await this.userRepository.exists({ _id: blockDTO.recieverUserId });
        if (!blockedUser) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (blockDTO.currentUserId.toString() == blockDTO.recieverUserId.toString()) {
            throw new utils_1.ForbiddenException("You cannot block yourself");
        }
        if (currentUserId.blockList.includes(blockDTO.recieverUserId)) {
            throw new utils_1.ForbiddenException("User is already blocked");
        }
        if (currentUserId.friendsRequest.includes(blockDTO.recieverUserId)) {
            await this.userRepository.update({ _id: blockDTO.currentUserId }, { $pull: { friendsRequest: blockDTO.recieverUserId } });
        }
        if (currentUserId.friends.includes(blockDTO.recieverUserId)) {
            await this.userRepository.update({ _id: blockDTO.currentUserId }, { $pull: { friends: blockDTO.recieverUserId } });
        }
        await this.userRepository.update({ _id: blockDTO.currentUserId }, { $addToSet: { blockList: blockedUser._id } });
        return res.status(200)
            .json({
            message: "User blocked successfully",
            success: true,
        });
    };
    unblockUser = async (req, res) => {
        const blockDTO = {
            currentUserId: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            recieverUserId: req.params.id
        };
        const blockedUser = await this.userRepository.exists({ _id: blockDTO.recieverUserId });
        if (!blockedUser) {
            throw new utils_1.NotFoundException("User not found");
        }
        await this.userRepository.update({ _id: blockDTO.currentUserId }, { $pull: { blockList: blockedUser._id } });
        return res.status(200)
            .json({
            message: "User unblocked successfully",
            success: true,
        });
    };
    getBlockList = async (req, res) => {
        const userId = (0, utils_1.verifyToken)(req.headers.authorization)._id;
        const blockList = await this.userRepository.exists({ _id: userId }, "blockList", { populate: [
                { path: "blockList", select: "fullName fristName lastName profilePicture _id" }
            ] });
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
    sendFriendRequest = async (req, res) => {
        const friendRequestDTO = {
            currentUserId: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            recieverUserId: req.params.id
        };
        const user = await this.userRepository.exists({ _id: friendRequestDTO.recieverUserId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (user.friendsRequest.includes(friendRequestDTO.currentUserId)) {
            throw new utils_1.ForbiddenException("You have already sent a friend request");
        }
        await this.userRepository.update({ _id: friendRequestDTO.recieverUserId }, { $push: { friendsRequest: friendRequestDTO.currentUserId } });
        return res.status(200)
            .json({
            message: "Friend request sent successfully",
            success: true,
        });
    };
    acceptFriendRequest = async (req, res) => {
        const friendRequestDTO = {
            currentUserId: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            recieverUserId: req.params.id
        };
        const currentUserId = await this.userRepository.getOne({ _id: friendRequestDTO.currentUserId });
        const user = await this.userRepository.exists({ _id: friendRequestDTO.recieverUserId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (!currentUserId.friendsRequest.includes(friendRequestDTO.recieverUserId)) {
            throw new utils_1.NotFoundException("Friend request not found");
        }
        if (currentUserId.friends.includes(friendRequestDTO.recieverUserId)) {
            throw new utils_1.ForbiddenException("You are already friends");
        }
        await this.userRepository.update({ _id: friendRequestDTO.recieverUserId }, { $pull: { friendsRequest: friendRequestDTO.currentUserId } });
        await this.userRepository.update({ _id: friendRequestDTO.currentUserId }, { $push: { friends: friendRequestDTO.recieverUserId } });
        await this.userRepository.update({ _id: friendRequestDTO.recieverUserId }, { $push: { friends: friendRequestDTO.currentUserId } });
        return res.status(200)
            .json({
            message: "Friend request accepted successfully",
            success: true,
        });
    };
    rejectFriendRequest = async (req, res) => {
        const friendRequestDTO = {
            currentUserId: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            recieverUserId: req.params.id
        };
        const currentUserId = await this.userRepository.getOne({ _id: friendRequestDTO.currentUserId });
        const user = await this.userRepository.exists({ _id: friendRequestDTO.recieverUserId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (!currentUserId.friendsRequest.includes(friendRequestDTO.recieverUserId)) {
            throw new utils_1.NotFoundException("Friend request not found");
        }
        await this.userRepository.update({ _id: friendRequestDTO.currentUserId }, { $pull: { friendsRequest: friendRequestDTO.recieverUserId } });
        return res.status(200)
            .json({
            message: "Friend request rejected successfully",
            success: true,
        });
    };
    removeFriend = async (req, res) => {
        const removeFriendDto = {
            currentUserId: (0, utils_1.verifyToken)(req.headers.authorization)._id,
            recieverUserId: req.params.id
        };
        const currentUserId = await this.userRepository.getOne({ _id: removeFriendDto.currentUserId });
        const user = await this.userRepository.exists({ _id: removeFriendDto.recieverUserId });
        if (!user) {
            throw new utils_1.NotFoundException("User not found");
        }
        if (!currentUserId.friends.includes(removeFriendDto.recieverUserId)) {
            throw new utils_1.ForbiddenException("this user is not your friend");
        }
        await this.userRepository.update({ _id: removeFriendDto.currentUserId }, { $pull: { friends: removeFriendDto.recieverUserId } });
        await this.userRepository.update({ _id: removeFriendDto.recieverUserId }, { $pull: { friends: removeFriendDto.currentUserId } });
        return res.status(200)
            .json({
            message: "Friend removed successfully",
            success: true,
        });
    };
}
exports.default = new UserService();
