"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExpiryTime = exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(Math.random() * 90000 + 10000).toString();
};
exports.generateOTP = generateOTP;
const generateExpiryTime = (time) => {
    return new Date(Date.now() + time);
};
exports.generateExpiryTime = generateExpiryTime;
