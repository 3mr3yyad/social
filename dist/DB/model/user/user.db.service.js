"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("./user.model");
const abstract_repository_1 = require("../../abstract.repository");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async getAllUsers() {
        return await this.model.find();
    }
}
exports.UserRepository = UserRepository;
