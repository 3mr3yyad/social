import { ForbiddenException, NotFoundException, verifyToken } from "../utils";
import { UserRepository } from "../DB";

export const isAuthenticatedGraphql = async (context: any) => {
    const token = context.token;

    const payload = verifyToken(token);

    const userRepository = new UserRepository();
    const user = await userRepository.exists({ _id: payload._id });

    if (!user) {
        throw new NotFoundException("User not found");
    }

    if (payload.exp! > Date.now()) {
        throw new ForbiddenException("session expired");
    }

    context.user = user;

}
