require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('--- Email Configuration Test ---');
    console.log('User:', process.env.EMAIL_USER ? process.env.EMAIL_USER : 'MISSING');
    console.log('Pass:', process.env.EMAIL_PASS ? '******' : 'MISSING');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('ERROR: Credentials missing in .env file');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email from Node',
            text: 'If you receive this, your email configuration is working!'
        });
        console.log('SUCCESS! Email sent:', info.messageId);
    } catch (error) {
        console.error('FAILED to send email.');
        console.error('Error Details:', error.message);
        if (error.response) console.error('SMTP Response:', error.response);
    }
};

testEmail();
