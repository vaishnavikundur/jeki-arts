require('dotenv').config();
const sendEmail = require('./utils/email');

const testUtility = async () => {
    console.log('Testing shared email utility...');
    const result = await sendEmail(process.env.EMAIL_USER, 'Utility Test', 'This is a test from the shared utility.');
    if (result.success) {
        console.log('Utility Test PASSED!');
    } else {
        console.error('Utility Test FAILED:', result.error || result.message);
    }
};

testUtility();
