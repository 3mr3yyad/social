import nodemailer from "nodemailer";
import { devConfig } from "../../config/env/dev.config";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

export async function sendEmail({to, subject, html}: MailOptions) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: devConfig.EMAIL,
            pass: devConfig.EMAIL_PASSWORD
        }
    });
    await transporter.sendMail({
        from: `"Social app" <${devConfig.EMAIL}>`,
        to,
        subject,
        html
    })
}