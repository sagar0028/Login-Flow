'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js specific hook for redirection
import Welcome from './components/Welcome';

export default function Login() {
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({ phone: '', email: '', otp: '' });
    const [infoMessage, setInfoMessage] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);

    const router = useRouter(); // Hook for navigating

    const validatePhoneNumber = (number: string) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(number);
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateOtp = (otp: string) => {
        const regex = /^[0-9]{4}$/;
        return regex.test(otp);
    };

    const handlePhoneLogin = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setErrors((prev) => ({ ...prev, phone: 'Invalid phone number. It should be 10 digits.' }));
            return;
        }
        setErrors((prev) => ({ ...prev, phone: '' }));

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            if (response.ok) {
                setOtpSent(true);
                setInfoMessage(`OTP has been sent to your phone number ${phoneNumber}.`);
            } else {
                setInfoMessage('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            setInfoMessage('An error occurred. Please try again.');
        }
    };

    const handleEmailLogin = async () => {
        if (!validateEmail(email)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email address.' }));
            return;
        }
        setErrors((prev) => ({ ...prev, email: '' }));

        try {
            const response = await fetch('/api/send-login-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setInfoMessage(`A login link has been sent to your email address ${email}.`);
            } else {
                setInfoMessage('Failed to send login link. Please try again.');
            }
        } catch (error) {
            setInfoMessage('An error occurred. Please try again.');
        }
    };

    const handleOtpVerification = async () => {
        if (!validateOtp(otp)) {
            setErrors((prev) => ({ ...prev, otp: 'Invalid OTP. It should be exactly 4 digits.' }));
            return;
        }
        setErrors((prev) => ({ ...prev, otp: '' }));

        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setInfoMessage('OTP verified successfully!');
                setShowWelcome(true);  // Show the Welcome component
                // redirect('/welcome');
            } else {
                setInfoMessage('Failed to verify OTP. Please try again.');
            }
        } catch (error) {
            setInfoMessage('An error occurred during OTP verification. Please try again.');
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
            setPhoneNumber(value);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (value.length <= 4 && /^[0-9]*$/.test(value)) {
            setOtp(value);
        }
    };

    
    if (showWelcome) {
        return <Welcome />;
    }

    return (
        <div className="max-w-md mx-auto mt-20 text-center">
            <h2 className="text-2xl font-bold mb-8">Login</h2>

            <div className="mb-4">
                <button
                    onClick={() => {
                        setLoginMethod('phone');
                        setInfoMessage('');
                        setOtpSent(false);
                    }}
                    className={`px-4 py-2 mr-2 ${loginMethod === 'phone' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Login with Phone
                </button>
                <button
                    onClick={() => {
                        setLoginMethod('email');
                        setInfoMessage('');
                    }}
                    className={`px-4 py-2 ${loginMethod === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Login with Email
                </button>
            </div>

            {loginMethod === 'phone' && !otpSent && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        maxLength={10}
                        className="w-full px-4 py-2 mb-2 border"
                    />
                    {errors.phone && <p className="text-red-500 mb-4">{errors.phone}</p>}
                    <button onClick={handlePhoneLogin} className="w-full px-4 py-2 bg-blue-500 text-white">
                        Send OTP
                    </button>
                    {infoMessage && <p className="text-green-500 mt-4">{infoMessage}</p>}
                </div>
            )}

            {loginMethod === 'phone' && otpSent && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength={4}
                        className="w-full px-4 py-2 mb-4 border"
                    />
                    {errors.otp && <p className="text-red-500 mb-4">{errors.otp}</p>}
                    <button onClick={handleOtpVerification} className="w-full px-4 py-2 bg-blue-500 text-white">
                        Verify OTP
                    </button>
                    {infoMessage && <p className="text-green-500 mt-4">{infoMessage}</p>}
                </div>
            )}

            {loginMethod === 'email' && (
                <div>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 mb-2 border"
                    />
                    {errors.email && <p className="text-red-500 mb-4">{errors.email}</p>}
                    <button onClick={handleEmailLogin} className="w-full px-4 py-2 bg-blue-500 text-white">
                        Send Login Link
                    </button>
                    {infoMessage && <p className="text-green-500 mt-4">{infoMessage}</p>}
                </div>
            )}
        </div>
    );
}
