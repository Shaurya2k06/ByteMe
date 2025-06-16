# BITS Token Smart Contract

## Overview

The BITS Token is an ERC20 smart contract for the UniByte campus ecosystem. Students use it to pay fees, shop on campus, and participate in events.

## Contract Details

- **Name**: BITSToken
- **Symbol**: BITS
- **Total Supply**: 1,000,000,000 BITS
- **Network**: Sepolia Testnet
- **Address**: `0xfEc060d0CF069ce6b1518445dB538058e9eE063d`

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key
ALCHEMY_API_KEY=your_alchemy_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. Compile and test:
```bash
npx hardhat compile
npx hardhat test
```

4. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Autopay System

Students can enable automatic monthly fee payments:
- **Amount**: 20,000 BITS per month
- **Interval**: Every 30 days
- **Admin**: `0x4f91bd1143168af7268eb08b017ec785c06c0e61`

Example:
```javascript
const amount = ethers.utils.parseUnits("20000", 18);
const interval = 30 * 24 * 60 * 60; // 30 days
await contract.enableAutopay(adminAddress, amount, interval);
```

## Testing

```bash
npx hardhat test
```

## Contract Verification

```bash
npx hardhat verify --network sepolia 0xfEc060d0CF069ce6b1518445dB538058e9eE063d "OWNER_ADDRESS"
```

Built by Team ByteMe
