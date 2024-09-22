import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text: any, params: any) => {
    return pool.query(text, params);
};
