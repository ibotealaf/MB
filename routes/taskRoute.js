import { Router } from 'express';
import {
    getAllUserTasks,
    createNewUserTask,
    getUserTaskById,
    updateUserTaskById,
    deleteUserTaskById,
} from '../controllers/taskController.js';

const router = Router();

/**
 * @description retrieves all the task of a user
 * @method GET
 * @route {host-url}/api/tasks
 * @api public
 */
router.get('/', getAllUserTasks);

/**
 * @description creates a new task
 * @method POST
 * @route {host-url}/api/tasks
 * @api public
 */
router.post('/', createNewUserTask);

/**
 * @description retrieves a single task by its id
 * @method GET
 * @route {host-url}/api/tasks/{id}
 * @api public
 */
router.get('/:taskId', getUserTaskById);

/**
 * @description changes a property(ies) of a task
 * @method  PUT
 * @route {host-url}/api/tasks/{id}
 */
router.put('/:taskId', updateUserTaskById);

/**
 * @description remove task from a user's task
 * @method DELETE
 * @route {host-url}/api/tasks/{id}
 * @api public
 */
router.delete('/:taskId', deleteUserTaskById);

export default router;
