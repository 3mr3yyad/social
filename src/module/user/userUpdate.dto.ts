import { GENDER } from "../../utils";

export interface UpdateUserDto {
    fullName?: string;
    phoneNumber?: string;
    gender?: GENDER;
}
