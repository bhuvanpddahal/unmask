import nodemailer from "nodemailer";
import { render } from "@react-email/components";

import VerifyEmailTemplate from "./templates/VerifyEmail";

export const sendVerificationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    const mailOptions = {
        from: {
            name: "Unmask",
            address: process.env.NODEMAILER_USER!
        },
        to: email,
        subject: "Verify your email",
        text: `This is your code: ${token}`,
        html: render(VerifyEmailTemplate({ token }))
    };

    await transporter.sendMail(mailOptions);
};