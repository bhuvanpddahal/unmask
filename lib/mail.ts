import nodemailer from "nodemailer";

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
        html: `<p>This is your code: <h1>${token}</h1></p>`
    };

    await transporter.sendMail(mailOptions);
};