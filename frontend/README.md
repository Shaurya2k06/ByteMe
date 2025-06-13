# UniByte Frontend

A React-based frontend for the UniByte campus ecosystem, featuring BITS token integration, MetaMask wallet connectivity, and a comprehensive campus management system.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS 4.1.8
- **Blockchain**: Ethers.js 5.7.2
- **Routing**: React Router DOM 7.6.2
- **UI Components**: Radix UI + Lucide React
- **Charts**: Chart.js + React-ChartJS-2
- **QR Codes**: react-qr-code + html5-qrcode
- **Animations**: Framer Motion

## Features

### 🏠 **Landing Page & Authentication**
- Modern landing page with typewriter effects and animations
- User registration and login system
- Integration with backend authentication

### 💰 **BITS Token Integration**
- MetaMask wallet connection
- BITS token balance display and transactions
- Automated fee payment system (20,000 BITS monthly)
- Autopay functionality for recurring payments
- Transaction history tracking

### 📊 **Student Dashboard**
- Real-time wallet balance and total spent tracking
- Monthly fee management with due date indicators
- Transaction history with status tracking
- Autopay enable/disable controls

### 🛍️ **Campus Services**
- **Shop**: Browse and purchase items with BITS tokens
- **Events**: View and register for campus events
- **QR System**: Generate and scan QR codes for transactions

### 🔐 **Wallet Features**
- MetaMask integration with connection state persistence
- Network switching to Sepolia testnet
- Account switching detection
- Connection status management

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Ensure MetaMask is installed
   - Switch to Sepolia testnet
   - Update contract address in `StudentDashboard.jsx` if needed

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Key Components

### Core Pages
- `LandingPage.jsx` - Marketing and introduction
- `Login.jsx` / `Signup.jsx` - Authentication
- `StudentDashboard.jsx` - Main BITS token interface
- `Shop.jsx` - Campus marketplace
- `Events.jsx` - Event management
- `QrPage.jsx` / `ScanPage.jsx` - QR code functionality

### Hooks
- `useMetamask.jsx` - MetaMask wallet connection and management

### Components
- `ConnectButton.jsx` - Wallet connection UI
- `Dashboard1.jsx` / `Dashboard2.jsx` - Dashboard sections
- `NavBar1.jsx` / `NavBar3.jsx` - Navigation components
- `QrCodeDisplay.jsx` / `QrScannner.jsx` - QR functionality

## BITS Token Integration

The frontend connects to the BITS ERC20 token contract on Sepolia testnet:

- **Contract Address**: `0xfEc060d0CF069ce6b1518445dB538058e9eE063d`
- **Monthly Fees**: 20,000 BITS (due 19th of each month)
- **Features**: Balance checking, transfers, autopay management

## Development

- Run `npm run dev` for development with hot reload
- Use `npm run lint` to check code quality
- Build with `npm run build` for production deployment

## Deployment

Configured for Vercel deployment with `vercel.json`. The build outputs to `dist/` directory.
