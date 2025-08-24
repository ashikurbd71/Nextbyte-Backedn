const axios = require('axios');

// Test SMS API with different configurations
async function testSmsApi() {
    const apiKey = process.env.BULKSMS_API_KEY;
    const phone = '8801581782193'; // Test phone number
    const otp = '1234';

    if (!apiKey) {
        console.error('BULKSMS_API_KEY not found in environment variables');
        return;
    }

    console.log('Testing SMS API with different configurations...\n');

    // Test 1: Form data with all fields
    console.log('=== Test 1: Form Data with All Fields ===');
    try {
        const formData = new URLSearchParams();
        formData.append('api_key', apiKey);
        formData.append('type', 'text');
        formData.append('contacts', phone);
        formData.append('senderid', '8809617625025');
        formData.append('msg', `Your NextByte Academy verification code is: ${otp}. Valid for 5 minutes.`);
        formData.append('campaign', 'NextByte Academy');
        formData.append('schedule', '');
        formData.append('unicode', '0');

        const response1 = await axios.post('https://bulksmsbd.net/api/smsapi', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 10000,
        });
        console.log('Response:', response1.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

    console.log('\n=== Test 2: JSON with Minimal Fields ===');
    try {
        const response2 = await axios.post('https://bulksmsbd.net/api/smsapi', {
            api_key: apiKey,
            type: 'text',
            contacts: phone,
            senderid: '8809617625025',
            msg: `Your NextByte Academy verification code is: ${otp}. Valid for 5 minutes.`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });
        console.log('Response:', response2.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

    console.log('\n=== Test 3: Different API Endpoint ===');
    try {
        const response3 = await axios.post('https://bulksmsbd.net/api/smsapi', {
            api_key: apiKey,
            type: 'text',
            contacts: phone,
            senderid: '8809617625025',
            msg: `Your NextByte Academy verification code is: ${otp}. Valid for 5 minutes.`,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 10000,
        });
        console.log('Response:', response3.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }

    console.log('\n=== Test 4: Check API Key Validity ===');
    try {
        // Try to get account info or balance
        const response4 = await axios.get(`https://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=balance`);
        console.log('Balance Check Response:', response4.data);
    } catch (error) {
        console.error('Balance Check Error:', error.response?.data || error.message);
    }
}

// Run the test
testSmsApi().catch(console.error);




