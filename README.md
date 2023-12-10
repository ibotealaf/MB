## In-Memory Task Management Application API

This application will allow users to create, view, update, and delete tasks, each
with a title, description, due date, and status. All data will be stored in memory,
meaning data is lost once the server is restarted, and this is acceptable for the
project.

### Commands

-   `git clone repo && cd repo` -> download & enter repo directory
-   `npm start` -> start prod
-   `npm run dev` -> start dev

### API endpoint

-   `POST /api/auth/register` -> create new user
-   `POST /api/auth/login` -> login user
-   `POST /api/tasks` -> create new task
-   `GET /api/tasks` -> fetch all users task
-   `GET /api/tasks/{taskId}` -> fetch single task
-   `PUT /api/tasks/{taskId}` -> update a task
-   `DELETE /api/tasks/{taskId}` -> delete a task
