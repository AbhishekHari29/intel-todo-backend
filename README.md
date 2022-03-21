# Task Manager API

### What is it?

This is a RESTful API, which allow users to manage their tasks.

## HTTP Endpoints

### User

-   Login User - POST("/users/login")
-   Logout User - POST("/users/logout")
-   Logout All - POST("/users/logoutAll")
-   Create User - POST("/users")
-   Read User Profile - GET("/users/me")
-   Read User by Id - GET("/users/:id")
-   Update User - PATCH("/users/me")
-   Delete User- DELETE("/users/me")
-   Upload avatar - POST("/users/me/avatar")
-   Get avatar by Id - GET("/users/:id/avatar")
-   DELETE avatar - DELETE("/users/me/avatar")

### Task

-   Create Task - POST("/tasks")
-   Read All Task - GET("/tasks")
-   Read Task - GET("/tasks/:id")
-   Update Task - PATCH("/tasks/:id")
-   Delete Task - DELETE("/tasks/:id")

## Technologies Used

- NodeJS
- ExpressJS
- MongoDB
