"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../utils/common/enums");
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
            return this.userAgent == enums_1.USER_AGENT.local ? true : false;
        }
    },
    cridentialsUpdatedAt: {
        type: Date
    },
    role: {
        type: String,
        enum: enums_1.SYS_ROLE,
        default: enums_1.SYS_ROLE.user
    },
    gender: { type: String, enum: enums_1.GENDER, default: enums_1.GENDER.male },
    userAgent: {
        type: String,
        enum: enums_1.USER_AGENT,
        default: enums_1.USER_AGENT.local
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
