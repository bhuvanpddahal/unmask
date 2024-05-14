import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Set it to true for any other ports than 587
        auth: {
            user: process.env.NODEMAILER_USER, // Gamail address
            pass: process.env.NODEMAILER_PASS // Gmail app password for this app
        }
    });

    const mailOptions = {
        from: { // Sender details
            name: "QuickCodeKit",
            address: process.env.NODEMAILER_USER!
        },
        // to: [email], // List of receivers
        to: email, // If you have a single receiver
        subject: "Verify your email",
        text: "This code expires in 10 minutes.",
        html: `<p>This is your code: <h1>${token}</h1></p>`,
        // Send attachments if you want to
        // attachments: [
        //     {
        //         filename: "test.pdf",
        //         path: "./public/fireworks.png",
        //         contentType: "application/pdf"
        //     },
        //     {
        //         filename: "fireworks.png",
        //         path: "./public/fireworks.png",
        //         contentType: "image/png"
        //     }
        // ]
    };

    await transporter.sendMail(mailOptions);
};