import db from '../config/dbConfig.js';
import { ObjectId } from 'mongodb';
import {
    findTaskById,
    findTaskByIdAndUpdateTask,
    findUserByEmailAndUpdateTask,
    saveNewTask,
} from '../services/dbServices.js';
import { sevenDaysFromNow } from '../utils/helper.js';

export function getAllUserTasks(request, response) {
    response.status(200).json({
        status: true,
        message: 'Retrieval successful',
        data: { tasks: request.user.tasks },
    });
}

export async function getUserTaskById(request, response) {
    const taskId = request.params.taskId;
    const user = request.user;

    if (taskId.length < 24) {
        return response.status(422).json({
            status: false,
            message: 'Something went wrong when attempting to fetch task.',
            error: 'Malformed task id',
        });
    }

    try {
        const task = await findTaskById(taskId);

        if (!task) {
            return response.status(404).json({
                status: false,
                message: 'Task not found',
                error: `Task with ID ${taskId} does not exist in your tasks`,
            });
        }

        if (!(task && task.userId.toString() == user._id)) {
            return response.status(403).json({
                status: false,
                message: "You can't view this resource",
                error: 'Permission denied',
            });
        }

        response.status(200).json({
            status: true,
            message: 'Retrieval successful',
            data: {
                ...task,
            },
        });
    } catch (err) {
        console.error(err);
        return response.status(500).json({
            status: false,
            message: 'Something went wrong!',
            error: 'Internal server error',
        });
    }
}

export async function createNewUserTask(request, response) {
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
        dueDate = sevenDaysFromNow();
    }

    const task = {
        title,
        description,
        dueDate: dueDate ?? defaultDueDate,
        status: false,
        userId: user._id,
    };

    try {
        const savedTask = await saveNewTask(task);
        user.tasks.push(savedTask.insertedId.toString());

        const updatedUser = await findUserByEmailAndUpdateTask(
            email,
            user.tasks
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
}

export async function updateUserTaskById(request, response) {
    const taskId = request.params.taskId;
    const { title, description, dueDate, status } = request.body;
    const user = request.user;

    if (taskId.length < 24) {
        return response.status(422).json({
            status: false,
            message:
                'Something went wrong. Task no longer exist or must have been deleted.',
            error: 'Malformed task id',
        });
    }
    try {
        const task = await findTaskById(taskId);

        if (!task) {
            return response.status(404).json({
                status: false,
                message: 'Task does not exist or has been deleted',
                error: `Task with ID ${taskId} does not exist in your tasks`,
            });
        }
        if (!(task && task.userId.toString() == user._id)) {
            return response.status(403).json({
                status: false,
                message: "You can't make modification to this resource",
                error: 'Permission denied',
            });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = !task.status;

        await findTaskByIdAndUpdateTask(task._id, task);
        // await db
        //     .collection('Tasks')
        //     .updateOne({ _id: task._id }, { $set: { ...task } });

        response.status(202).json({
            status: true,
            message: 'Updated successfully',
            data: {
                ...task,
            },
        });
    } catch (err) {
        console.error(err);
        return response.status(500).json({
            status: false,
            message: 'Something went wrong!',
            error: 'Internal server error',
        });
    }
}

export async function deleteUserTaskById(request, response) {
    const taskId = request.params.taskId;
    let user = request.user;

    if (taskId.length < 24) {
        return response.status(422).json({
            status: false,
            message:
                'Something went wrong. Task no longer exist or must have been deleted.',
            error: 'Malformed task id',
        });
    }
    try {
        const task = await db
            .collection('Tasks')
            .findOneAndDelete({ _id: new ObjectId(taskId) });

        if (!task) {
            return response.status(404).json({
                status: false,
                message: 'Task does not exist or has been deleted',
                error: `Task with ID ${taskId} does not exist in your tasks`,
            });
        }
        if (!(task && task.userId.toString() == user._id)) {
            return response.status(403).json({
                status: false,
                message: "You can't make modification to this resource",
                error: 'Permission denied',
            });
        }

        user.tasks = user.tasks.filter(function getTask(id) {
            return id != task._id.toString();
        });

        const updatedUser = await db
            .collection('Users')
            .findOneAndUpdate(
                { email: user.email },
                { $set: { tasks: user.tasks } }
            );

        console.log(updatedUser);

        response.status(204).json({
            status: true,
            message: 'Deleted successfully',
        });
    } catch (err) {
        console.error(err);
        return response.status(500).end();
    }
}
