import { JwtPayload } from "jsonwebtoken";
import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enums";
import { ObjectId } from "mongoose";

export interface IAttachment {
    id: string;
    url: string;
}

export interface IUser {
    _id: ObjectId;
    fristName: string;
    lastName: string;
    fullName?: string;
    email: string;
    phoneNumber?: string;
    password: string;
    cridentialsUpdatedAt?: Date;
    role: SYS_ROLE;
    gender: GENDER;
    userAgent: USER_AGENT;
    otp?: string;
    otpExpiry?: Date;
    isVerified?: boolean;
}

export interface IReaction {
    reaction: REACTION;
    userId: ObjectId;
}

export interface IPost {
    _id: ObjectId;
    userId: ObjectId;
    content: string;
    reactions: IReaction[];
    attachments?: IAttachment[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: ObjectId;
    userId: ObjectId;
    postId: ObjectId;
    parentId: ObjectId[];
    content: string;
    attachments?: IAttachment[];
    reactions: IReaction[];
}

export interface IPayLoad extends JwtPayload {
    _id: string;
    role: SYS_ROLE;
    fullName: string;
    gender: GENDER;
}

declare module "jsonwebtoken" {
    interface JwtPayload {
        _id: string;
        role: SYS_ROLE;
        fullName: string;
        gender: GENDER;
    }
}

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}
