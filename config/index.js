import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const config = {
    DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017',
    PORT: process.env.PORT || 5000,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET_KEY || crypto.randomBytes(16),
};

export default config;
