import { NextFunction, Request, Response } from "express";
import { ForbiddenException, NotFoundException, verifyToken } from "../utils";
import { UserRepository } from "../DB";

export const isAuthenticated = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
    
        const payload = verifyToken(token!);
    
        const userRepository = new UserRepository();
        const user = await userRepository.exists({ _id: payload._id });
    
        if (!user) {
            throw new NotFoundException("User not found");
        }
    
        if (payload.exp! > Date.now()) {
            throw new ForbiddenException("session expired");
        }
    
        // TODO: check user agent, logged out from all, deleted
        req.user = user;
        next();
    }
}
