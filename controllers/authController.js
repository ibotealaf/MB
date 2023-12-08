import { generateToken, modifyUserData } from '../utils/helper.js';
import { findUserByEmail, saveNewUser } from '../services/dbServices.js';

export async function registerUser(request, response) {
    const { name, email, password } = request.body;
    if (!(email && password)) {
        return response.status(422).json({
            status: false,
            message: 'Please provide email and password',
            error: 'Email and password required',
        });
    }

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
        password,
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
}

export async function loginUser(request, response) {
    const { email, password } = request.body;

    const user = await findUserByEmail(email);

    if (!(user && user.password == password)) {
        return response.status(422).json({
            status: false,
            message: 'Invalid email or password',
            error: 'Incorrect email or password',
        });
    }

    let token = generateToken(user.email);

    response.status(200).json({
        status: true,
        message: 'Login successful',
        data: {
            token,
            name: user.name,
            tasks: user.tasks,
        },
    });
}
