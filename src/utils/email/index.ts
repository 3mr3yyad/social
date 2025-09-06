import nodemailer from "nodemailer";

export async function sendEmail({to, subject, html}: {to:string, subject:string, html:string}) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    await transporter.sendMail({
        from: `"Social app" <${process.env.EMAIL}>`,
        to,
        subject,
        html
    })
}