import nodemailer from 'nodemailer';

const transprter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const sendOtp = async (toEmail,otp ) => {
    await transprter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 15 minutes.`,
    });
}

export const shouldSendEmail = ()  =>{
  return (
    process.env.SEND_EMAIL !== "false" &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
}
