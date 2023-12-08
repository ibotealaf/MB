import express from 'express';
import config from './config/index.js';
import router from './routes/index.js';

const app = express();
app.set('x-powered-by', '');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(config.PORT, () =>
    console.log(`server is running on ${config.PORT}`)
);
