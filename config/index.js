import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const config = {
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'example',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    PORT: process.env.PORT || 5000,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET_KEY || crypto.randomBytes(16),
};

export const PG_DB_CONFIG = {
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
};

export default config;
