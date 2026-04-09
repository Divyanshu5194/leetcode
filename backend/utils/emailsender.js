import Nodemailer from "nodemailer"
import { MailtrapTransport } from "mailtrap"

const sendEmail=async (sname,semail,recipient,resetUrl)=>{

    const TOKEN = process.env.MAILTRAP_API;

    const transport = Nodemailer.createTransport(
    MailtrapTransport({
        token: TOKEN,
    })
    );

    const sender = {
    address: "hello@demomailtrap.co",
    name: "Mailtrap Test",
    };
    const recipients = [
    recipient,
    ];

    transport
    .sendMail({
        from: sender,
        to: recipients,
        subject: "Reset Your Leetcode Password",
        text: `Click On This LInk BElow For Resetting Your Password ${resetUrl}`,
        category: "Integration Test",
    })
    .then(console.log, console.error);
}

export {sendEmail}