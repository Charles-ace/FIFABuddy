# FIFABuddy — World Cup 2026 AI Agent DApp on X Layer Mainnet

FIFABuddy is a futuristic World Cup 2026 prediction market and AI co-pilot DApp built on X Layer mainnet, OKX's high-performance Ethereum L2. It combines live football feeds, decentralized betting markets, and Claude-powered sentiment analysis to let users copy-trade the smartest sports analysts.

Wallet connections default to X Layer mainnet and only allow MetaMask or OKX Wallet.

Live Demo Link: [https://fifabuddy.vercel.app](https://fifabuddy.vercel.app) *(Placeholder)*

---

## Deployed Contracts

Set your X Layer mainnet contract addresses in `frontend/.env.local` after deploying the contracts you want to use.

---

## Tech Stack
- **Smart Contracts**: Solidity (0.8.20), Hardhat, OpenZeppelin, Ethers v6
- **Frontend DApp**: Next.js 14, React 18, TailwindCSS, TypeScript
- **Web3 Wallet Flow**: Wagmi v2, Viem v2, MetaMask and OKX Wallet integration
- **AI Analytics**: Anthropic Claude AI Copilot (`claude-sonnet-4-20250514`)
- **Football Feeds**: OpenFootball APIs merged with live API-Football RapidAPI feeds

---

## Getting Started

### 1. Configure Environment Variables

Create `.env` inside `contracts/`:
```env
PRIVATE_KEY=your_wallet_private_key
OKLINK_API_KEY=your_oklink_api_key
```

Create `.env.local` inside `frontend/`:
```env
NEXT_PUBLIC_PREDICTION_ADDRESS=0xa47B8dfFFa148a07c1328BEc77b21BE42e584fE6
NEXT_PUBLIC_COMMUNITY_ADDRESS=0x9161BeC6a57E0e6328328BEc77b21BE42e584B12
NEXT_PUBLIC_REGISTRY_ADDRESS=0xE605B8dfFFa148a07c1328BEc77b21BE42e584B34
NEXT_PUBLIC_USDT_ADDRESS=0xd211BeC6a57E0e6328328BEc77b21BE42e584A67b

NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
NEXT_PUBLIC_CHAIN_ID=196

ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 2. Deploy & Compile Contracts
```bash
cd contracts
npm install
npx hardhat test
npx hardhat run scripts/deploy.js --network xlayer
```

### 3. Run Frontend Local Development Server
```bash
cd ../frontend
npm install
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

---

## X Layer Network Details

Add the network details below to OKX Web3 Wallet or MetaMask:

- **Network Name**: X Layer Mainnet
- **New RPC URL**: `https://rpc.xlayer.tech`
- **Chain ID**: `196`
- **Currency Symbol**: `OKB`
- **Block Explorer URL**: `https://www.okx.com/web3/explorer/xlayer`

**Faucet**: X Layer mainnet does not have a faucet.
