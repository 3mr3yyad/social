import { FilterQuery, UpdateQuery } from "mongoose";
import { UserRepository } from "../../../DB";
import { IUser, NotFoundException, UnauthorizedException } from "../../../utils";
import { VerifyEmailDTO } from "../auth.dto";

export const authProvider = {
    async checkOTP(verifyEmailDTO: VerifyEmailDTO) {
        const userRepository = new UserRepository();
        const userExists = await userRepository.exists({
            email: verifyEmailDTO.email
        });

        if(!userExists){
            throw new NotFoundException("User not found");
        }

        if(userExists.otp != verifyEmailDTO.otp){
            throw new UnauthorizedException("Invalid OTP");
        }

        if((userExists.otpExpiry as Date) < new Date()){
            throw new UnauthorizedException("OTP expired");
        }
    },

    async updateUser(filter:FilterQuery<IUser>,update:UpdateQuery<IUser>) {
        const userRepository = new UserRepository();
        await userRepository.update(filter,update)
    }
}