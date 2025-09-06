import { IUser } from "../../../utils/common/interface";
import { User } from "./user.model";
import { AbstractRepository } from "../../abstract.repository";
import { RootFilterQuery } from "mongoose";

export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User)
    }
    async getAllUsers() {
        return await this.model.find()
    }
    async getSpacificUser(filter:RootFilterQuery<IUser>) {
        return await this.getOne(filter)
    }
}