"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = require("../../config/env/dev.config");
async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: dev_config_1.devConfig.EMAIL,
            pass: dev_config_1.devConfig.EMAIL_PASSWORD
        }
    });
    await transporter.sendMail({
        from: `"Social app" <${dev_config_1.devConfig.EMAIL}>`,
        to,
        subject,
        html
    });
}
