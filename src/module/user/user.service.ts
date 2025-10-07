import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { UpdateUserDto } from "./userUpdate.dto";
import { NotFoundException, UnauthorizedException } from "../../utils";

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
        const updateUserDto: UpdateUserDto = req.body;

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
}

export default new UserService();
