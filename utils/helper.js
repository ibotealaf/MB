import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import hash from './hash.js';
import config from '../config/index.js';

const jwtOptions = {
    issuer: 'master_backend_task',
    expiresIn: '3d',
};

export async function encryptPassword(data) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);
    return hash;
}

export function comparePassword(data, encryptedData) {
    return bcrypt.compare(data, encryptedData);
}

export function modifyUserData(data) {
    const user = Object.assign({}, data);
    Object.defineProperty(data, 'token', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: hash.encrypt(data.email),
    });
    delete user.password;
    return user;
}

export function generateToken(payload) {
    return jwt.sign(payload, config.ACCESS_TOKEN, jwtOptions);
}

export function verifyToken(token) {
    return jwt.verify(token, config.ACCESS_TOKEN, jwtOptions);
}

export function sevenDaysFromNow() {
    const date = new Date(Date.now());
    const plusSevenDays = new Date(
        date.setDate(date.getDate() + 7)
    ).toLocaleDateString();
    return plusSevenDays;
}
