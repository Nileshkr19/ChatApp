# 💬 Chat App Server

A modern, full-featured Node.js/Express chat application server with comprehensive API testing, real-time messaging capabilities, and secure user authentication.

## ✨ Features

### 🔐 Authentication & User Management

- JWT-based authentication (Access & Refresh tokens)
- Secure password hashing with bcrypt
- Cookie-based session management
- User profiles with bio and online status
- Protected routes with middleware

### 💬 Chat System

- Create and manage chat conversations
- Real-time messaging with Socket.io
- Message CRUD operations
- Chat participant management

### 📁 File Management

- File upload with Cloudinary integration
- Multer middleware for file handling
- Secure file storage and retrieval

### 🗄️ Database

- PostgreSQL with Prisma ORM
- Automated migrations
- Type-safe database operations
- Relationship management

### 🧪 Testing

- **Comprehensive Cypress E2E test suite**
- **12 automated tests** covering all API endpoints
- Authentication flow testing
- Chat and message API testing
- Shared helper functions for test reusability

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, bcrypt
- **File Storage**: Cloudinary
- **Real-time**: Socket.io
- **Testing**: Cypress E2E Testing
- **Environment**: dotenv

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) database
- [Cloudinary](https://cloudinary.com/) account

## 🛠️ Installation

1. **Clone and navigate:**

   ```bash
   git clone https://github.com/Nileshkr19/ChatApp.git
   cd ChatApp/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="2h"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

## 🗄️ Database Setup

1. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

2. **Run migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

3. **View database (optional):**
   ```bash
   npx prisma studio
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production Mode

```bash
npm start
```

## 🧪 Testing

### Run All Tests

```bash
npm run cy:test
```

### Interactive Testing

```bash
npm run cy:open
```

### Test Coverage

- **Authentication Tests** (6 tests): Registration, login, logout, protected routes
- **Chat Tests** (4 tests): Create, fetch, update, delete chats
- **Message Tests** (2 tests): Send messages, fetch chat messages

## 📡 API Endpoints

### 🔐 Authentication Routes (`/api/v1/users`)

```
POST   /register     - Register new user
POST   /login        - User login
POST   /logout       - User logout
GET    /me           - Get current user profile
PUT    /profile      - Update user profile
```

### 💬 Chat Routes (`/api/v1/chats`)

```
GET    /             - Get all user chats
POST   /             - Create new chat
GET    /:id          - Get specific chat
DELETE /:id          - Delete chat
```

### 📝 Message Routes (`/api/v1/messages`)

```
POST   /             - Send message
GET    /:chatId      - Get chat messages
PUT    /:messageId/edit    - Edit message
DELETE /:messageId/delete - Delete message
POST   /:messageId/read   - Mark as read
```

### 🔄 Token Routes (`/api/v1/tokens`)

```
POST   /refresh      - Refresh access token
```

## 📁 Project Structure

```
server/
├── 📁 src/
│   ├── 📁 controllers/     # Request handlers
│   ├── 📁 middlewares/     # Auth, error handling
│   ├── 📁 routes/          # API route definitions
│   ├── 📁 utils/           # Helper functions
│   ├── � config/          # Database config
│   └── 📁 socket/          # Real-time messaging
├── 📁 cypress/             # E2E test suite
│   ├── 📁 e2e/            # Test files
│   └── 📁 support/        # Test helpers
├── 📁 prisma/             # Database schema
├── 📄 app.js              # Express app setup
├── 📄 index.js            # Server entry point
└── 📄 cypress.config.js   # Test configuration
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for token storage
- CORS configuration
- Input validation and sanitization
- Protected routes with auth middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Testing Guidelines

- All new features should include corresponding tests
- Run tests before submitting PRs: `npm run cy:test`
- Tests are automatically run on GitHub Actions (coming soon)

## � License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Nilesh Kumar** - [GitHub](https://github.com/Nileshkr19)

---

⭐ **Star this repo if you found it helpful!**

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Prisma database schema
│   └── migrations/            # Database migration files
├── src/
│   ├── config/
│   │   └── prisma.js          # Prisma client configuration
│   ├── controllers/
│   │   ├── users.controllers.js  # User management logic
│   │   └── tokens.controllers.js # Token management logic
│   ├── lib/
│   │   └── auth.js            # Authentication utilities
│   ├── middlewares/
│   │   ├── auth.middleware.js    # Authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── multer.middleware.js # File upload middleware
│   ├── routes/
│   │   ├── user.routes.js        # User API routes
│   │   └── tokens.routes.js      # Token API routes
│   ├── services/              # Business logic services
│   ├── socket/                # Socket.io configuration
│   ├── upload/                # File upload utilities
│   └── utils/
│       ├── ApiError.js        # Custom error class
│       ├── ApiResponse.js     # Standardized API responses
│       ├── AsyncHandler.js    # Async error handler wrapper
│       └── cloudinary.js      # Cloudinary configuration
├── app.js                     # Route definitions and middleware setup
├── index.js                   # Server entry point
├── package.json               # Dependencies and scripts
└── .env                       # Environment variables (create this)
```

## 🔧 Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio (database GUI)

## 🌐 API Endpoints

The server will be available at `http://localhost:3000` with the following API structure:

### Base URL: `/api/v1`

#### User Management

- **POST** `/users/register` - User registration
- **POST** `/users/login` - User login
- **GET** `/users/profile` - Get user profile (authenticated)
- **PUT** `/users/profile` - Update user profile (authenticated)
- **POST** `/users/logout` - User logout

#### Token Management

- **POST** `/tokens/refresh-token` - Refresh access token

### Authentication

Most endpoints require JWT authentication via cookies or Authorization header.

> 📖 **For detailed request/response examples, see the [API Documentation](#-api-documentation) section below.**

## 📦 Dependencies

### Main Dependencies

- **express**: Fast, unopinionated web framework for Node.js
- **prisma**: Next-generation ORM for database management
- **@prisma/client**: Auto-generated database client
- **bcrypt**: Password hashing library
- **jsonwebtoken**: JWT implementation for authentication
- **cloudinary**: Cloud-based image and video management
- **multer**: File upload handling middleware
- **multer-storage-cloudinary**: Cloudinary storage for multer
- **cookie-parser**: Cookie parsing middleware
- **cors**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management
- **ms**: Time string parser for token expiration

### Development Dependencies

- **nodemon**: Development server with automatic restarts

## 📚 API Documentation

### Authentication Endpoints

<details>
<summary><strong>POST /api/v1/users/register</strong> - Register a new user</summary>

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123abc",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": null,
      "bio": null,
      "isOnline": false,
      "createdAt": "2025-07-22T10:30:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

</details>

<details>
<summary><strong>POST /api/v1/users/login</strong> - User login</summary>

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123abc",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": null,
      "bio": null,
      "isOnline": true
    }
  },
  "message": "Login successful"
}
```

**Cookies Set:**

- `accessToken` (HttpOnly, Secure in production)
- `refreshToken` (HttpOnly, Secure in production)

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

</details>

### User Management Endpoints

<details>
<summary><strong>GET /api/v1/users/profile</strong> - Get user profile (Authenticated)</summary>

**Headers:**

```
Authorization: Bearer <access_token>
```

_Or send accessToken via cookies_

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123abc",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://cloudinary.com/image.jpg",
      "bio": "Software Developer",
      "isOnline": true,
      "lastSeen": "2025-07-22T10:30:00.000Z",
      "createdAt": "2025-07-22T08:00:00.000Z"
    }
  },
  "message": "Profile retrieved successfully"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Access token required"
}
```

</details>

<details>
<summary><strong>PUT /api/v1/users/profile</strong> - Update user profile (Authenticated)</summary>

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John Smith",
  "bio": "Full Stack Developer",
  "profileImage": "https://cloudinary.com/new-image.jpg"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123abc",
      "name": "John Smith",
      "email": "john@example.com",
      "profileImage": "https://cloudinary.com/new-image.jpg",
      "bio": "Full Stack Developer",
      "isOnline": true,
      "updatedAt": "2025-07-22T11:00:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

</details>

### Token Management Endpoints

<details>
<summary><strong>POST /api/v1/tokens/refresh-token</strong> - Refresh access token</summary>

**Option 1 - Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Option 2 - Cookies:**

```
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxyz123abc",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://cloudinary.com/image.jpg",
      "bio": "Software Developer"
    }
  },
  "message": "Tokens refreshed successfully"
}
```

**New Cookies Set:**

- `accessToken` (New access token)
- `refreshToken` (New refresh token)

**Error Responses:**

```json
// No refresh token provided
{
  "success": false,
  "message": "Refresh token is required. Please provide it in cookies or request body."
}

// Invalid refresh token
{
  "success": false,
  "message": "Invalid refresh token"
}

// Refresh token not found in database
{
  "success": false,
  "message": "Refresh token not recognized"
}

// User not found
{
  "success": false,
  "message": "User not found"
}
```

</details>

<details>
<summary><strong>POST /api/v1/users/logout</strong> - User logout (Authenticated)</summary>

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**

- `accessToken` (Removed)
- `refreshToken` (Removed)
</details>

### Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Optional array of validation errors"]
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created (for registration)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

## 🧪 Testing the API

### Using cURL

**Register a new user:**

```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Get profile (using saved cookies):**

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -b cookies.txt
```

**Refresh token:**

```bash
curl -X POST http://localhost:5000/api/v1/tokens/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your-refresh-token-here"}'
```

### Using Postman or Thunder Client

1. **Set Base URL**: `http://localhost:5000/api/v1`
2. **For authenticated endpoints**:
   - Add `Authorization: Bearer <access_token>` header, OR
   - Use cookie authentication if tokens are stored in cookies
3. **Content-Type**: Set to `application/json` for POST/PUT requests

### Environment Variables for Testing

Create a `.env.test` file for testing:

```env
PORT=5001
NODE_ENV=test
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp_test"
JWT_SECRET="test-secret-key"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="test-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"
```

## 🗃️ Database Schema

### User Model

- **id**: Unique identifier (CUID)
- **name**: User's display name
- **email**: Unique email address
- **password**: Hashed password
- **profileImage**: Optional profile image URL
- **bio**: Optional user biography
- **isOnline**: Online status tracking
- **lastSeen**: Last activity timestamp
- **createdAt/updatedAt**: Timestamp tracking

### RefreshToken Model

- **id**: Unique identifier (CUID)
- **userId**: Reference to User
- **token**: Unique refresh token
- **expiresAt**: Token expiration
- **isRevoked**: Revocation status

### Chat Model

- **id**: Unique identifier (CUID)
- **name**: Optional chat name (for group chats)
- **type**: Chat type (private, group)
- **participants**: Users in the chat
- **messages**: All messages in the chat
- **lastMessageAt**: Timestamp of last message
- **createdBy**: User who created the chat
- **createdAt/updatedAt**: Timestamp tracking

### Message Model

- **id**: Unique identifier (CUID)
- **senderId**: Reference to User who sent the message
- **content**: Message text content
- **messageType**: Type of message (text, image, file)
- **fileUrl**: Optional file URL for media messages
- **chatId**: Reference to Chat
- **readBy**: Read receipts tracking
- **isEdited**: Whether message was edited
- **createdAt/updatedAt**: Timestamp tracking

### MessageRead Model

- **id**: Unique identifier (CUID)
- **messageId**: Reference to Message
- **userId**: Reference to User who read the message
- **readAt**: When the message was read

## 🔐 Security Notes

1. **Never commit your `.env` file** - It contains sensitive information
2. **Use strong JWT secrets** - Generate a secure random string
3. **Validate all inputs** - Implement proper input validation
4. **Use HTTPS in production** - Never send sensitive data over HTTP

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors:**

   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in `.env`
   - Check database credentials

2. **Prisma client errors:**

   - Run `npx prisma generate` after schema changes
   - Ensure migrations are up to date

3. **File upload errors:**

   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper middleware setup

4. **Port already in use:**
   - Change PORT in `.env` file
   - Kill existing processes on the port

## 📝 Next Steps

1. ✅ Set up basic authentication system (completed)
2. ✅ Implement user management (completed)
3. ✅ Set up refresh token mechanism (completed)
4. 🔄 Implement Socket.io for real-time chat features
5. 🔄 Add chat rooms and messaging functionality
6. 🔄 Complete file upload integration
7. 🔄 Add input validation middleware
8. 🔄 Implement rate limiting
9. 🔄 Add comprehensive API documentation (Swagger/OpenAPI)
10. 🔄 Set up proper logging system
11. 🔄 Configure for production deployment
12. 🔄 Add automated testing

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

For any issues or questions, please check the troubleshooting section or create an issue in the repository.
