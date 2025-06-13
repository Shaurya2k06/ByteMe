# UniByte - Digital Campus Ecosystem

<div align="center">
  <img src="frontend/public/navbarLogo.svg" alt="UniByte Logo" width="120" height="120">
  
  [![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red.svg)](https://github.com/ByteMe-Team)
  [![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)
  [![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-purple.svg)](https://ethereum.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 🌟 Overview

**UniByte** is a comprehensive digital campus ecosystem that revolutionizes student life through blockchain technology. It serves as a digital wallet and event hub where students can earn, spend, and explore with the custom BITS token built specifically for campus activities.

### Key Features

- 🔗 **Blockchain Integration**: Built on Ethereum with custom BITS token (ERC20)
- 💳 **Digital Wallet**: Secure MetaMask integration for token management
- 🔄 **Autopay System**: Automated monthly fee payments via smart contracts
- 📱 **QR Code Payments**: Seamless peer-to-peer payment system with QR codes
- 🎫 **Event Management**: Campus event discovery, registration, and participation
- 🛍️ **Campus Shop**: Token-based marketplace for campus goods and services
- 👥 **Multi-Role Support**: Students, admins, and developers with role-based access

## 🏗️ Architecture

The project consists of three main components:

```
UniByte/
├── 🎨 frontend/          # React + Vite frontend application
├── 🔧 backend/           # Node.js + Express API server
└── 📜 contracts/         # Ethereum smart contracts (Hardhat)
```

## 🚀 Tech Stack

### Frontend
- **React 18** with **Vite** for fast development
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** for modern, responsive styling
- **Ethers.js v5** for blockchain interaction
- **MetaMask** integration for wallet connectivity
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with **Express** framework
- **MongoDB** with **Mongoose** for data persistence
- **JWT** authentication with wallet signature verification
- **CORS** enabled for cross-origin requests
- **bcrypt** for secure password hashing
- **dotenv** for environment configuration

### Blockchain
- **Solidity 0.8.28** smart contracts
- **Hardhat** development environment with testing
- **OpenZeppelin** for secure contract standards
- **ERC20** token implementation with autopay features
- **Alchemy/Infura** for blockchain connectivity

## 📋 Prerequisites

Before running UniByte, ensure you have:

- **Node.js** (v16.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **MetaMask** browser extension
- **Git** for version control
- **Ethereum testnet ETH** for testing (Sepolia recommended)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Shaurya2k06/ByteMe.git
cd ByteMe
```

### 2. Environment Setup

Create `.env` files in each directory:

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb://localhost:27017/unibyte
JWT_SECRET=your_jwt_secret_here_32_chars_min
TOKENIZING_KEY=your_tokenizing_key_here_32_chars_min
```

**Contracts** (`contracts/.env`):
```env
PRIVATE_KEY=your_wallet_private_key_without_0x
ALCHEMY_API_KEY=your_alchemy_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Smart contract dependencies
cd ../contracts
npm install
```

### 4. Deploy Smart Contracts

```bash
cd contracts

# For local development
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy.js --network localhost

# For testnet (Sepolia)
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Update Contract Address

After deployment, update the contract address in your frontend:

```javascript
// frontend/src/StudentDashboard.jsx
const BITS_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 6. Start the Services

```bash
# Start backend server (Terminal 1)
cd backend
npm start
# Server runs on http://localhost:9092

# Start frontend development server (Terminal 2)
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 🎯 Core Features

### 💰 BITS Token System
- **Custom ERC20 Token**: BITS token with 18 decimals and 1 billion total supply
- **Autopay Subscriptions**: Monthly automatic fee deductions (20,000 BITS)
- **Authorized Collectors**: Secure payment collection system for admins
- **Balance Management**: Real-time token balance tracking and transaction history

### 🔐 Authentication & Security
- **Dual Authentication**: Traditional email/password + MetaMask wallet authentication
- **Signature Verification**: Ethereum signature-based login with nonce verification
- **JWT Tokens**: Secure session management with 24-hour expiration
- **Role-Based Access**: Admin, user, and developer roles with different permissions

### 📱 Payment & QR System
- **QR Code Generation**: 30-day valid payment tokens for easy transfers
- **Peer-to-Peer Payments**: Instant blockchain-based transactions between users
- **Transaction History**: Complete payment tracking with timestamps and amounts
- **Fee Management**: Automated campus fee collection and tracking

### 🎪 Event Management
- **Event Discovery**: Browse and search campus events by tags, dates, and locations
- **Token-Based Registration**: Pay event fees using BITS tokens
- **Event Creation**: Admin interface for creating and managing events
- **Registration Tracking**: Monitor event participation and payments

### 🛍️ Campus Marketplace
- **Digital Shop**: Token-based marketplace for campus goods and services
- **Item Management**: Create, browse, and purchase items using BITS tokens
- **Purchase History**: Track all marketplace transactions and purchases

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

### Contract Compilation
```bash
cd contracts
npx hardhat compile
```

### Test Coverage
The smart contracts include comprehensive tests for:
- Token minting, burning, and transfers
- Autopay subscription management
- Authorized collector functionality
- Error handling and edge cases

## 📱 API Endpoints

### Public Routes
- `POST /public/signup` - Traditional user registration
- `POST /public/login` - Email/password authentication
- `POST /public/walletSignup` - Wallet-based registration with signature
- `POST /public/walletLogin` - Wallet-based authentication
- `GET /public/nonce/:walletAddress` - Get signing nonce for wallet auth

### Protected Routes (Requires JWT)
- `GET /user/getProfile` - Get user profile data
- `PATCH /user/updateWallet` - Update user wallet address
- `GET /user/allStudents` - Get all students (admin only)
- `POST /qr/createQR` - Generate QR payment token
- `POST /qr/verifyQR` - Verify QR token for payments
- `GET /events/getAllEvents` - List all campus events
- `POST /events/joinEvent` - Register for events with token payment
- `POST /events/createEvent` - Create new events (admin only)
- `GET /shop/getItems` - Browse marketplace items
- `POST /shop/purchaseItem` - Purchase items with tokens

## 🔒 Security Features

### Smart Contract Security
- **OpenZeppelin Standards**: Using battle-tested contract implementations
- **Access Control**: Owner-only functions with proper access modifiers
- **Reentrancy Protection**: Safe transfer patterns and state management
- **Emergency Functions**: Admin withdrawal capabilities for stuck tokens

### Backend Security
- **JWT Validation**: Secure token-based authentication
- **Wallet Signature Verification**: Cryptographic proof of wallet ownership
- **Input Validation**: Comprehensive data sanitization and validation
- **CORS Configuration**: Controlled cross-origin access policies
- **Environment Variables**: Secure configuration management

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Set production environment variables
npm start
```

### Smart Contract Deployment (Mainnet)
```bash
cd contracts
npx hardhat run scripts/deploy.js --network mainnet
npx hardhat verify --network mainnet DEPLOYED_ADDRESS "CONSTRUCTOR_ARGS"
```

## 📊 Current Status

### Deployed Contracts
- **BITS Token**: `0xfEc060d0CF069ce6b1518445dB538058e9eE063d`
- **Admin Account**: `0x4f91bd1143168af7268eb08b017ec785c06c0e61`
- **Network**: Ethereum Sepolia Testnet

### Live Application
- **Frontend**: https://www.uni-byte.tech
- **Backend API**: http://localhost:9092 (development)

## 🤝 Contributing

We welcome contributions to UniByte! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting
- Add proper error handling and logging

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👥 Team ByteMe

**Project Lead & Blockchain Developer**: Shaurya Srivastava
**Backend Development**: Utkarsh Mani Tripathi
**Frontend Development**: Shantanav Mukherjee   
**UI/UX Design**: Purva Pote  

## 🆘 Support & Contact

For support, questions, or collaboration:

- 📧 **Email**: shaurya2k06@gmail.com
- 🌐 **Website**: [www.uni-byte.tech](https://www.uni-byte.tech)
- 💬 **Issues**: [GitHub Issues](https://github.com/Shaurya2k06/ByteMe/issues)
- 📱 **Social**: Follow us for updates and announcements


## 📈 Performance & Scalability

- **Transaction Speed**: Near-instant token transfers
- **Gas Optimization**: Efficient smart contract functions
- **Caching Strategy**: Redis implementation for API responses
- **Database Indexing**: Optimized MongoDB queries
- **CDN Integration**: Fast asset delivery worldwide

---

<div align="center">
  <p>Made with ❤️ by Team ByteMe</p>
  <p>© 2025 UniByte. All rights reserved.</p>
  <p><em>"Revolutionizing campus life, one token at a time"</em></p>
</div>