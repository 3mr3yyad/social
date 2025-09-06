import { Schema } from "mongoose";
import { IUser } from "../../../utils/common/interface";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils/common/enums";

export const userSchema = new Schema<IUser>({
    fristName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: function () {
            return this.userAgent == USER_AGENT.local ? true : false;
        }
    },
    cridentialsUpdatedAt: {
        type: Date
    },
    role: {
        type: String,
        enum: SYS_ROLE,
        default: SYS_ROLE.user
    },
    gender:
        { type: String, enum: GENDER, default: GENDER.male },
    userAgent: {
        type: String,
        enum: USER_AGENT,
        default: USER_AGENT.local
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

userSchema.virtual("fullName")
    .get(function () {
    return `${this.fristName} ${this.lastName}`;
    })
    .set(function (value:string) {
    const [fName, lName] = value.split(" ");
    this.fristName = fName as string;
    this.lastName = lName as string;
})