import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";

export const generateToken = ({
    payload,
    secretKey = devConfig.JWT_SECRET,
    options = { expiresIn: "1d" }
}
    : {
    payload: object,
    secretKey?: string,
    options?: SignOptions
}) => {
    return jwt.sign(payload, secretKey!, options);
}

export const verifyToken = (
    token: string,
    secretKey: string = devConfig.JWT_SECRET as string
) => {
    return jwt.verify(token, secretKey) as JwtPayload;
}
