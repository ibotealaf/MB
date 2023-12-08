import db from '../config/dbConfig.js';
import hash from './hash.js';

export async function detokenize(request, response, next) {
    const auth = request.headers.authorization;

    if (!(auth && auth.startsWith('Bearer'))) {
        return response.status(401).json({
            status: false,
            message: 'you need to login to access resources',
            error: 'invalid access',
        });
    }
    const token = auth.split(' ')[1];

    try {
        const payload = hash.decrypt(token);
        const user = await db.collection('Users').findOne({ email: payload });
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
