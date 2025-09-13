"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
class UserService {
    userRepository = new DB_1.UserRepository();
    constructor() {
    }
    getProfile = async (req, res, next) => {
        const user = await this.userRepository.getOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Done",
            success: true,
            data: user
        });
    };
}
exports.default = new UserService();
