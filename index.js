import express from 'express';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

const hash = encryption();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const PORT = process.env.PORT || 6000;

const mongoClient = new MongoClient(MONGODB_URI);
await mongoClient.connect();
const db = mongoClient.db('master_backend');
const collections = db.collection('tasks');

const app = express();
app.set('x-powered-by', '');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', detokenize);

/**
 * @description register a new user
 * @method POST
 * @route {host-url}/register
 * @api public
 */
app.post('/register', async function (request, response) {
    const { name, email, password } = request.body;
    if (!(email && password)) {
        return response.status(422).json({
            status: false,
            message: 'Please provide email and password',
            error: 'Email and password required',
        });
    }
    const newUser = {
        name,
        email,
        password,
        tasks: [],
    };
    const user = await collections.insertOne(newUser);
    console.log(user);

    const userData = Object.assign({}, newUser);
    Object.defineProperty(userData, 'token', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: hash.encrypt(userData.email),
    });
    delete userData.password;

    response.status(201).json({
        status: true,
        message: 'account has been created',
        data: {
            ...userData,
        },
    });
});

/**
 * @description user login for the session
 * @method POST
 * @route {host-url}/login
 * @api public
 */
app.post('/login', async function (request, response) {
    const { email, password } = request.body;

    const user = await collections.findOne({ email });

    if (!user) {
        return response.status(422).json({
            status: false,
            message: 'Invalid email or password',
            error: 'Incorrect email or password',
        });
    }

    let token = hash.encrypt(user.email);

    response.status(202).json({
        status: true,
        message: 'Login successful',
        data: {
            token,
            name: user.name,
            tasks: user.tasks,
        },
    });
});

/**
 * @description retrieves all the task of a user
 * @method GET
 * @route {host-url}/task
 * @api public
 */
app.get('/tasks', async function (request, response) {
    response.status(200).json({
        status: true,
        message: 'Retrieval successful',
        data: { tasks: request.user.tasks },
    });
});

/**
 * @description retrieves a single task by its id
 * @method GET
 * @route {host-url}/task/{id}
 * @api public
 */
app.get('/tasks/:taskId', function (request, response) {
    const taskId = request.params.taskId;
    const user = request.user;

    const task = user.tasks.find(function getTask(task) {
        return task.id == taskId;
    });
    if (!task) {
        return response.status(404).json({
            status: false,
            message: 'Task not found',
            error: `Task with ID ${formattedTaskId} does not exist in your tasks`,
        });
    }

    response.status(200).json({
        status: true,
        message: 'Retrieval successful',
        data: {
            ...task,
        },
    });
});

/**
 * @description creates a new task
 * @method POST
 * @route {host-url}/tasks
 * @api public
 */
app.post('/tasks', async function (request, response) {
    let { title, description, dueDate } = request.body;
    const user = request.user;

    if (!title) {
        return response.status(400).json({
            status: false,
            message: 'Kindly provide a title to the task',
            error: 'Task was not given a title',
        });
    }
    if (!dueDate) {
        const date = new Date(Date.now());
        const sevenDaysFromNow = new Date(
            date.setDate(date.getDate() + 7)
        ).toLocaleDateString();
        dueDate = sevenDaysFromNow;
    }

    const newTask = {
        title,
        description,
        dueDate: dueDate ?? defaultDueDate,
        id: generateId(),
        status: false,
    };
    user.tasks.push(newTask);

    try {
        const updatedUser = await collections.updateOne(
            { email: user.email },
            { $set: { tasks: user.tasks } }
        );
    } catch (err) {
        console.error(err);
        return response.status(500).end();
    }

    response.status(201).json({
        status: true,
        message: 'Task successfully created',
        data: newTask,
    });
});

/**
 * @description changes a property(ies) of a task
 * @method  PUT
 * @route {host-url}/tasks/{id}
 */
app.put('/tasks/:taskId', async function (request, response) {
    const taskId = request.params.taskId;
    const { title, description, dueDate, status } = request.body;

    const user = request.user;
    const task = user.tasks.find(function getTask(task) {
        return task.id == taskId;
    });
    if (!task) {
        return response.status(404).json({
            status: false,
            message: 'Task does not exist or has been deleted',
            error: `Task with ID ${formattedTaskId} does not exist in your tasks`,
        });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = !task.status;

    try {
        await collections.updateOne(
            { email: user.email },
            { $set: { tasks: user.tasks } }
        );
    } catch (err) {
        console.error(err);
        return response.status(500).end();
    }

    response.status(202).json({
        status: true,
        message: 'Updated successfully',
        data: {
            ...task,
        },
    });
});

/**
 * @description remove task from a user's task
 * @method DELETE
 * @route {host-url}/tasks/{id}
 * @api public
 */
app.delete('/tasks/:taskId', async function (request, response) {
    const taskId = request.params.taskId;

    let user = request.user;
    let task = user.tasks.find(function getTask(task) {
        return task.id == taskId;
    });
    if (!task) {
        return response.status(404).json({
            status: false,
            message: 'Task not found',
            error: `Task with ID ${formattedTaskId} does not exist in your tasks`,
        });
    }

    user.tasks = user.tasks.filter(function getTask(t) {
        return t.id != task.id;
    });

    try {
        await collections.updateOne(
            { email: user.email },
            { $set: { tasks: user.tasks } }
        );
    } catch (err) {
        console.error(err);
        return response.status(500).end();
    }

    response.status(204).json({
        status: true,
        message: 'Deleted successfully',
    });
});

app.listen(PORT, () => console.log(`server is running on ${PORT}`));

function generateId() {
    return Math.floor(Math.random() * 1000);
}

function encryption() {
    const algorithm = 'aes-256-cbc';
    const initVector = crypto.randomBytes(16);
    const securityKey = crypto.randomBytes(32);

    return {
        encrypt: function encrypt(data) {
            const cipher = crypto.createCipheriv(
                algorithm,
                securityKey,
                initVector
            );

            let encryptedData = cipher.update(data, 'utf-8', 'hex');
            encryptedData += cipher.final('hex');
            return encryptedData;
        },

        decrypt: function decrypt(encryptedData) {
            const decipher = crypto.createDecipheriv(
                algorithm,
                securityKey,
                initVector
            );

            let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
            decryptedData += decipher.final('utf-8');
            return decryptedData;
        },
    };
}

async function detokenize(request, response, next) {
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
        const user = await collections.findOne({ email: payload });
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
        return response.status(401).json({
            status: false,
            message: 'token expired',
            error: 'token expired',
        });
    }
}
