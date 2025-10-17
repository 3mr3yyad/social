import { verifyToken } from "../../utils";
import { UserRepository } from "../../DB";
import { NotFoundException } from "../../utils";
import { Socket } from "socket.io";

export const socketAuth = async (socket: Socket, next: Function) => {
    try {
        const { authorization } = socket.handshake.auth;
        const payload = verifyToken(authorization);
        const userRepo = new UserRepository();
        const user = await userRepo.getOne({ _id: payload._id })
        if (!user) {
            throw new NotFoundException("User not found");
        }
        socket.data.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
