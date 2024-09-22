
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || ' ';

export const generateToken = (userId: string, email: string, name: string) => {
    return jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '4h' });
};
