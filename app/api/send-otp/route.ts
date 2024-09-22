import { NextResponse } from 'next/server';
import { query } from '../../lib/db';
import axios from 'axios';
export async function POST(request: Request) {
    try {
        const { phoneNumber } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
        }

        // query to find an existing code for the phone number
        const existingCodeResult = await query('SELECT * FROM users WHERE phone_number = $1', [phoneNumber]);
        const existingCode: any = existingCodeResult.rows[0];

        const now = new Date();
        let verificationOtp;

        if (existingCode && now < existingCode.expireAt) {
            // use the existing otp if it hasn't expired
            verificationOtp = existingCode.code;
        } else {
            // generate a new otp and save it
            verificationOtp = Math.floor(100000 + Math.random() * 900000);
            const expireAt = new Date(now.getTime() + 5 * 60000); // 5 minutes from now

            // Insert or update the otp
            await query(
                existingCode
                    ? 'UPDATE users SET code = $1, expireAt = $2 WHERE phone_number = $3'
                    : 'INSERT INTO users (phone_number, code, expireAt) VALUES ($1, $2, $3)',
                existingCode ? [verificationOtp, expireAt, phoneNumber] : [phoneNumber, verificationOtp, expireAt]
            );
        }

        // Send the OTP 
        const result = await sendOtpPost(verificationOtp, phoneNumber);

        if (result) {
            return NextResponse.json({success: true, message: 'OTP sent successfully', otp: verificationOtp });
        } else {
            return NextResponse.json({success: false, message: 'Failed to send OTP' }, { status: 400 });
        }
    } catch (err) {
        console.error('Error:', err);
        return NextResponse.json({success: false, message: 'Internal server error' }, { status: 500 });
    }
}

const sendOtpPost = async (otp: string | number, mobile: string) => {
    try {
        let data = JSON.stringify({
            "route": "dlt",
            "sender_id": `${process.env.SMS_SENDER_ID}`,
            "message": "164993",
            "variables_values": otp,
            "flash": 0,
            "numbers": mobile
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.FASRSMS_URL}`,
            headers: {
                'Authorization': `${process.env.FASTSMS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios.request(config);
        return response.data.return;
    } catch (err) {
        return false;
    }
}