import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";

export class User {
    public fullName!: string;
    public email!: string;
    public phoneNumber!: string;
    public password!: string;
    public cridentialsUpdatedAt!: Date;
    public role!: SYS_ROLE;
    public gender!: GENDER;
    public userAgent!: USER_AGENT;
    public otp!: string;
    public otpExpiry!: Date;
    public isVerified!: boolean;
}
