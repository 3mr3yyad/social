import { Schema } from "mongoose";
import { GENDER, IUser, sendEmail, SYS_ROLE, USER_AGENT } from "../../../utils";

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
        type: Number,
        enum: SYS_ROLE,
        default: SYS_ROLE.user
    },
    gender:
        { type: Number, enum: GENDER, default: GENDER.male },
    userAgent: {
        type: Number,
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
    },
    twoStepVerified: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    blockList: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    friendsRequest: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: "User"
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

userSchema.pre("save", async function (next) {
        if(this.userAgent != USER_AGENT.google && this.isNew)
            await sendEmail({
                    to: this.email,
                    subject: "Verify your email",
                    html: `<h1>Verify your email</h1>
                    <p>Your confirmation -otp- code is: <b><mark>${this.otp}</mark></b></p>
                    <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
                })
    })