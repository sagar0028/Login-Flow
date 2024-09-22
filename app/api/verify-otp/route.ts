import { generateToken } from '@/app/helper/auth';
import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { otp, phoneNumber } = await request.json();

        const userOtp: any = await query('SELECT * FROM users WHERE phone_number = $1', [phoneNumber]);
        const existingCode: any = userOtp.rows[0];
        if (otp == existingCode.code) {
            const access_token = generateToken(existingCode.id, existingCode.email, existingCode.name);
            return NextResponse.json({ success: true, token: access_token, message: 'OTP sent successfully' }, { status: 200 });
        }
        else {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }
    } catch (err) {
        return NextResponse.json({ success: false, Error: err, message: 'Something Went Wrong' }, { status: 500 });
    }
}
