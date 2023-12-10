import db from '../config/dbConfig.js';

export async function findUserByEmail(email) {
    const result = await db.query(
        'SELECT user_id, name, email FROM Users WHERE email = $1',
        [email]
    );
    return result.rows[0];
}

export function saveNewUser(user) {
    return db.query(
        'INSERT INTO Users(name, email, password) VALUES($1, $2, $3)',
        [user.name, user.email, user.password]
    );
}

export async function findTaskById(taskId, userId) {
    const result = await db.query(
        'SELECT * FROM Tasks WHERE task_id = $1 AND user_id = $2',
        [taskId, userId]
    );
    return result.rows[0];
}

export function findTaskByIdAndUpdate(id, task) {
    return db.query(
        'UPDATE Tasks SET title = $2, description = $3, due_date = $4, status = $5 WHERE task_id = $1',
        [id, task.title, task.description, task.due_date, task.status]
    );
}

export function saveNewTask(task) {
    return db.query(
        'INSERT INTO Tasks(title, description, due_date, status, user_id) VALUES($1, $2, $3, $4, $5)',
        [task.title, task.description, task.dueDate, task.status, task.userId]
    );
}

export function findTaskIdAndDelete(taskId, userId) {
    return db.query('DELETE FROM Tasks WHERE task_id = $1 AND user_id = $2', [
        taskId,
        userId,
    ]);
}

export async function getTasksUserCreated(id) {
    const result = await db.query(
        'SELECT * FROM Tasks WHERE user_id = $1 ORDER BY due_date',
        [id]
    );
    return result.rows;
}
