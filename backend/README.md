# UniByte Backend API

## Overview

Node.js backend API for the UniByte campus ecosystem. Handles user authentication, campus events, marketplace, QR payments, and fee management with MongoDB.

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** authentication
- **bcrypt** for password hashing
- **CORS** enabled for frontend integration

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (`.env`):
```env
MONGO_URI=mongodb://localhost:27017/unibyte
JWT_SECRET=your_jwt_secret_here
TOKENIZING_KEY=your_tokenizing_key_here
```

3. Start the server:
```bash
npm start
```

Server runs on http://localhost:9092

## API Routes

### Public Routes (No auth required)
- `POST /public/signup` - Traditional user registration
- `POST /public/login` - Email/password authentication
- `POST /public/walletSignup` - Wallet-based registration with signature
- `POST /public/walletLogin` - Wallet-based authentication
- `GET /public/nonce/:walletAddress` - Get signing nonce for wallet auth

### Protected Routes (Requires JWT)
- `GET /user/getProfile` - Get user profile data
- `PATCH /user/updateWallet` - Update user wallet address
- `GET /user/allStudents` - Get all students (admin only)
- `GET /user/purchaseHistory` - Get purchase history

### Events
- `GET /events/getAllEvents` - List all campus events
- `POST /events/joinEvent` - Register for events
- `POST /events/createEvent` - Create new events (admin only)
- `GET /events/getEvent` - Get user's registered events

### Shop
- `GET /shop/getItems` - Browse marketplace items
- `POST /shop/createItem` - List items for sale
- `POST /shop/purchaseItem` - Purchase items
- `GET /shop/search` - Search marketplace items

### QR Payments
- `GET /qr/createQR` - Generate QR payment token
- `POST /qr/verifyQR` - Verify QR token for payments

### Fee Management
- `POST /fee/pay-fee` - Process fee payments

## Authentication

### Traditional Auth
Uses JWT tokens with email/username and password. Tokens expire in 24 hours.

### Wallet Auth
- Get nonce from `/public/nonce/:walletAddress`
- Sign message with wallet
- Submit signature for login/signup

## Database Models

### User
- Username, email, password (optional for wallet users)
- Wallet address, role (admin/user/dev)
- Events registration, fee status

### Events
- Event details, date, organizer
- Amount to be paid, tags

### Shop Items
- Item name, description, price, quantity
- Owner, images (base64)

### Purchases
- User, item, quantity, timestamp

## Role-Based Access

- **admin**: Can create events, manage users
- **user**: Standard campus user
- **dev**: Developer/special access

## Error Handling

All endpoints return standardized JSON responses:
```json
{
  "message": "Description of result/error",
  "data": {} // Additional data if successful
}
```

## CORS Configuration

Configured for:
- https://www.uni-byte.tech (production)
- http://localhost:5173 (development)

Built by Team ByteMe