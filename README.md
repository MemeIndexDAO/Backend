# MemeIndex Backend

Backend service for the MemeIndex Telegram Mini App, handling user interactions, coin registration, voting system, and task management.

## Features

- 👤 User Management
  - User registration via Telegram
  - Daily rewards system
  - Vote balance tracking

- 🪙 Coin System
  - Coin registration
  - Voting mechanism
  - Vote tracking and leaderboard

- ✅ Task System
  - Daily tasks
  - Task completion rewards
  - Progress tracking

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd MemeIndex/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### User Routes
- `POST /api/user/register` - Register new user
  ```json
  {
    "telegramId": "string",
    "username": "string"
  }
  ```

- `POST /api/user/daily-reward` - Claim daily reward
  ```json
  {
    "telegramId": "string"
  }
  ```

### Coin Routes
- `POST /api/coin/register` - Register new coin
  ```json
  {
    "address": "string",
    "name": "string",
    "symbol": "string",
    "registeredBy": "string"
  }
  ```

- `POST /api/coin/vote` - Vote for a coin
  ```json
  {
    "userId": "string",
    "coinAddress": "string",
    "amount": "number"
  }
  ```

### Task Routes
- `POST /api/task/complete` - Complete a task
  ```json
  {
    "userId": "string",
    "taskId": "string"
  }
  ```

## Project Structure

```
Backend/
├── src/
│   ├── models/          # Database models
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   └── app.js          # Main application file
├── .env                # Environment variables
├── .gitignore         # Git ignore file
└── package.json       # Project dependencies
```

## Database Models

### User
- telegramId (String, unique)
- username (String)
- votesBalance (Number)
- lastDailyReward (Date)
- completedTasks (Array)
- registeredAt (Date)

### Coin
- address (String, unique)
- name (String)
- symbol (String)
- totalVotes (Number)
- registeredBy (String)
- registeredAt (Date)

### Vote
- userId (String)
- coinAddress (String)
- amount (Number)
- votedAt (Date)

### Task
- title (String)
- description (String)
- rewardVotes (Number)
- isDaily (Boolean)

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## Development

To run in development mode with hot reload:
```bash
npm run dev
```

## Production

For production deployment:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 