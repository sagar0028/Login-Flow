import { NextResponse } from 'next/server';
import { query } from "../../lib/db"
import { generateToken } from '@/app/helper/auth';
import axios from 'axios';


export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    const user: any = await findUserByEmail(email);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const token = generateToken(user.id, user.email, user.name);

    const loginLink = `${process.env.NEXT_PUBLIC_BASE_URL}/login?token=${encodeURIComponent(token)}`;

    const result = await sendLoginLink(email, loginLink);

    if (result) {
        return NextResponse.json({ success: true, message: 'Login link sent successfully' });
    } else {
        return NextResponse.json({ success: false, message: 'Failed to send login link' }, { status: 500 });
    }
}

export const findUserByEmail = async (email: string) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};


export const sendLoginLink = async (email: string, loginLink: string) => {
    try {
        const data = {
            personalizations: [
                {
                    to: [{ email }],
                    dynamic_template_data: {
                        loginLink,
                    },
                },
            ],
            from: { email: process.env.SENDER_EMAIL },
            template_id: process.env.EMAIL_TEMPLATE_ID,
        };

        const config = {
            method: 'post',
            url: 'https://api.sendgrid.com/v3/mail/send',
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        };

        const response = await axios.request(config);
        return response.status === 202;
    } catch (err) {
        console.error('Error sending email:', err);
        return false;
    }
};
