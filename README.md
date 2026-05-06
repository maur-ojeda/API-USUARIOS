# API-USUARIOS

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![REST API](https://img.shields.io/badge/API-REST-005571?logo=smartthings&logoColor=white)
![Status](https://img.shields.io/badge/status-active_development-green)

REST API for user management with authentication. Built with Node.js and TypeScript.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Architecture:** REST API

## Features

- User CRUD operations
- Authentication layer
- RESTful endpoint design

## API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create user |
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/auth/login` | Authenticate user |

> Endpoint paths may vary. See full API documentation for details.

## Setup

```bash
# Clone
git clone https://github.com/maur-ojeda/API-USUARIOS.git
cd API-USUARIOS

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run in development
npm run dev
```

## API Documentation

Full endpoint documentation with request/response examples will be available at `/api/docs` when running locally.

## License

This project is proprietary. All rights reserved.
