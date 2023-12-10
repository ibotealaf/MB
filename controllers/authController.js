import {
    comparePassword,
    encryptPassword,
    generateToken,
    modifyUserData,
} from '../utils/helper.js';
import { findUserByEmail, saveNewUser } from '../services/dbServices.js';
import db from '../config/dbConfig.js';

export async function registerUser(request, response) {
    const { name, email, password } = request.body;
    if (!(email && password)) {
        return response.status(422).json({
            status: false,
            message: 'Please provide email and password',
            error: 'Email and password required',
        });
    }

    try {
        const userExist = await findUserByEmail(email);

        if (userExist) {
            return response.status(409).json({
                status: false,
                message: 'Something went wrong when attempting to sign up',
                error: 'Invalid sign up',
            });
        }

        const newUser = {
            name,
            email,
            password: await encryptPassword(password),
            tasks: [],
        };

        await saveNewUser(newUser);
        const user = modifyUserData(newUser);

        response.status(201).json({
            status: true,
            message: 'account has been created',
            data: {
                ...user,
            },
        });
    } catch (err) {
        console.error(err);
    }
}

export async function loginUser(request, response) {
    const { email, password } = request.body;

    try {
        const { rows } = await db.query(
            'SELECT * FROM Users WHERE email = $1',
            [email]
        );
        const user = rows[0];
        const verifyPassword = user
            ? await comparePassword(password, user?.password)
            : null;

        if (!(user && verifyPassword)) {
            return response.status(422).json({
                status: false,
                message: 'Invalid email or password',
                error: 'Incorrect email or password',
            });
        }

        let accessToken = generateToken({ email: user.email });

        response.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
                accessToken,
                name: user.name,
            },
        });
    } catch (err) {
        console.error(err);
    }
}
