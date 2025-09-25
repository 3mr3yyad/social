"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
exports.userSchema = new mongoose_1.Schema({
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
            return this.userAgent == utils_1.USER_AGENT.local ? true : false;
        }
    },
    cridentialsUpdatedAt: {
        type: Date
    },
    role: {
        type: Number,
        enum: utils_1.SYS_ROLE,
        default: utils_1.SYS_ROLE.user
    },
    gender: { type: Number, enum: utils_1.GENDER, default: utils_1.GENDER.male },
    userAgent: {
        type: Number,
        enum: utils_1.USER_AGENT,
        default: utils_1.USER_AGENT.local
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema.virtual("fullName")
    .get(function () {
    return `${this.fristName} ${this.lastName}`;
})
    .set(function (value) {
    const [fName, lName] = value.split(" ");
    this.fristName = fName;
    this.lastName = lName;
});
exports.userSchema.pre("save", async function (next) {
    if (this.userAgent != utils_1.USER_AGENT.google && this.isNew)
        await (0, utils_1.sendEmail)({
            to: this.email,
            subject: "Verify your email",
            html: `<h1>Verify your email</h1>
                    <p>Your confirmation -otp- code is: <b><mark>${this.otp}</mark></b></p>
                    <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
        });
});
