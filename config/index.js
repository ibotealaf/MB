import dotenv from 'dotenv';

dotenv.config();

const config = {
    DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017',
    PORT: process.env.PORT || 5000,
};

export default config;
