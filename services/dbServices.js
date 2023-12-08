import { ObjectId } from 'mongodb';
import db from '../config/dbConfig.js';

export function findUserByEmail(email) {
    return db.collection('Users').findOne({ email });
}

export function findUserByEmailAndUpdateTask(email, tasks) {
    return db.collection('Users').updateOne({ email }, { $set: { tasks } });
}

export function saveNewUser(user) {
    return db.collection('Users').insertOne(user);
}

export function findTaskById(id) {
    return db.collection('Tasks').findOne({ _id: new ObjectId(taskId) });
}

export function findTaskByIdAndUpdateTask(id, task) {
    return db
        .collection('Tasks')
        .updateOne({ _id: task._id }, { $set: { ...task } });
}

export function saveNewTask(task) {
    return db.collection('Tasks').insertOne(newTask);
}
