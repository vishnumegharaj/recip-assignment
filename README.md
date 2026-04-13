# Recip.to

## Description
Recip.to is a project designed to manage and store user data efficiently. It includes features for user authentication, database management, and API routing.

## Features
- User authentication
- Database backup and restore
- API routing for user-related operations

## Project Structure
```
recip.to/
├── controllers/
│   └── auth.js
├── db_backup/
│   └── recipto/
│       ├── users.bson
│       └── users.metadata.json
├── models/
│   └── users.js
├── routes/
│   └── auth.js
├── data.json
├── package.json
├── README.md
├── server.js
├── users.json
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vishnumegharaj/recip-assignment
   ```
2. Navigate to the project directory:
   ```bash
   cd recip.to
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the server:
   ```bash
   npm start
   ```
2. For development with live reload:
   ```bash
   npm run dev
   ```

## Scripts
- `npm start`: Starts the server.
- `npm run dev`: Starts the server with live reload using nodemon.

## Dependencies
- Node.js
- Express
- Nodemon

