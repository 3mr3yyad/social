import bcrypt from "bcryptjs";

export const generateHash = (plainText: string): string => {
    
    return bcrypt.hashSync(plainText, 10)
}

export const compareHash = (password: string, hashPassword: string): boolean => {
    return bcrypt.compareSync(password, hashPassword)
}
