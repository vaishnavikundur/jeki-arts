const nodemailer = require('nodemailer');

// Create transporter once
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !process.env.EMAIL_USER.includes('demo')) {
            console.log(`[EMAIL] Attempting to send to ${to}...`);
            const info = await transporter.sendMail({
                from: `"Jeki Arts" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text
            });
            console.log(`[EMAIL SENT] ID: ${info.messageId} | To: ${to}`);
            return { success: true, messageId: info.messageId };
        } else {
            console.log(`[MOCK EMAIL] Config is demo. To: ${to}`);
            return { success: false, message: 'Email config is demo/missing' };
        }
    } catch (err) {
        console.error(`[EMAIL ERROR] Failed to send to ${to}:`, err.message);
        return { success: false, error: err.message };
    }
};

module.exports = sendEmail;
