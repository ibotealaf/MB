import {
    findTaskById,
    findTaskByIdAndUpdate,
    findTaskIdAndDelete,
    getTasksUserCreated,
    saveNewTask,
} from '../services/dbServices.js';
import { sevenDaysFromNow } from '../utils/helper.js';

export async function getAllUserTasks(request, response) {
    const result = await getTasksUserCreated(request.user.user_id);

    response.status(200).json({
        status: true,
        message: 'Retrieval successful',
        data: result,
    });
}

export async function getUserTaskById(request, response) {
    const taskId = Number(request.params.taskId);
    const user = request.user;

    const task = taskId ? await findTaskById(taskId, user.user_id) : null;

    if (!task) {
        return response.status(404).json({
            status: false,
            message: 'Task not found',
            error: `Task with ID ${request.params.taskId} does not exist in your tasks`,
        });
    }

    response.status(200).json({
        status: true,
        message: 'Retrieval successful',
        data: {
            ...task,
        },
    });
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
        userId: user.user_id,
    };

    await saveNewTask(task);

    response.status(201).json({
        status: true,
        message: 'Task successfully created',
        data: task,
    });
}

export async function updateUserTaskById(request, response) {
    const taskId = Number(request.params.taskId);
    const { title, description, dueDate, status } = request.body;
    const user = request.user;

    const task = taskId ? await findTaskById(taskId, user.user_id) : null;

    if (!task) {
        return response.status(404).json({
            status: false,
            message: 'Task does not exist or has been deleted',
            error: `Task with ID ${request.params.taskId} does not exist in your tasks`,
        });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.due_date = dueDate;
    if (status) task.status = !task.status;

    const result = await findTaskByIdAndUpdate(taskId, task);

    if (!result?.rowCount) {
        return response.status(500).json({
            status: false,
            message: 'Something went wrong when attempting to save task',
        });
    }

    response.status(202).json({
        status: true,
        message: 'Updated successfully',
        data: {
            ...task,
        },
    });
}

export async function deleteUserTaskById(request, response) {
    const taskId = Number(request.params.taskId);
    let user = request.user;

    const result = taskId
        ? await findTaskIdAndDelete(taskId, user.user_id)
        : null;

    if (!result?.rowCount) {
        return response.status(404).json({
            status: false,
            message: 'Task does not exist or has been deleted',
            error: `Task with ID ${request.params.taskId} does not exist in your tasks`,
        });
    }

    response.status(204).json({
        status: true,
        message: 'Deleted successfully',
    });
}
