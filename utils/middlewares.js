import db from '../config/dbConfig.js';
import { verifyToken } from './helper.js';

export async function detokenize(request, response, next) {
    const auth =
        request.headers.authorization || request.headers['Authorization'];

    if (!(auth && auth.startsWith('Bearer'))) {
        return response.status(401).json({
            status: false,
            message: 'you need to login to access resources',
            error: 'invalid access',
        });
    }
    const token = auth.split(' ')[1];

    try {
        const payload = verifyToken(token);
        const user = await db
            .collection('Users')
            .findOne({ email: payload.email });
        if (!user) {
            return response.status(401).json({
                status: false,
                message: 'you need to login to access resources',
                error: 'invalid access',
            });
        }

        request.user = user;
        next();
    } catch (err) {
        console.error(err);
        return response.status(401).json({
            status: false,
            message: 'token expired',
            error: 'token expired',
        });
    }
}

export function errorHandler(error, request, response, next) {
    next(error);
}

export function unknownEndpoint(request, response, next) {
    response.status(404).json({
        status: false,
        message: 'resource not found',
    });
}
