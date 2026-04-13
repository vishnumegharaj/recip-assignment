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

## Database Indexes

Open terminal and run the following command:

```node check-indexes.js
```

## OR 
Manually verify in mongosh
Run in mongosh to verify:
```js
use recipto
db.users.getIndexes()
```

Expected output:
```json
[
  { "key": { "_id": 1 }, "name": "_id_" },
  { "key": { "email": 1 }, "name": "email_1", "unique": true },
  { "key": { "phone": 1 }, "name": "phone_1", "unique": true },
  { "key": { "isBlocked": 1, "kycStatus": 1 }, "name": "isBlocked_1_kycStatus_1" },
  { "key": { "createdAt": -1 }, "name": "createdAt_-1" }
]
```

### Index justification
- `email` unique index — primary lookup field for all user queries and updates
- `phone` unique index — enforces no duplicate phone numbers
- `isBlocked + kycStatus` compound index — admin queries filtering blocked/pending users hit this index instead of scanning all documents
- `createdAt` descending — efficient pagination and sorting by newest users first

