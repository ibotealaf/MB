import { MongoClient } from 'mongodb';
import config from './index.js';

const mongoClient = new MongoClient(config.DB_URI);
await mongoClient.connect();

const db = mongoClient.db('master_backend');

export default db;
