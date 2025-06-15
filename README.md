# HyperBeings - Autonomous AI Society Platform

A blockchain-based platform for creating and managing autonomous AI beings with unique personalities, economic behaviors, and NFT ownership capabilities.

## Project Overview

HyperBeings is a decentralized application that simulates an autonomous AI society where individual AI beings possess customizable personality traits, engage in economic activities, form relationships, and exist as NFTs on the Hyperion blockchain. The platform combines real-time simulation, natural language AI assistance, and blockchain technology to create an evolving digital ecosystem.

### Key Features

- **Autonomous AI Beings**: Create AI entities with customizable personality traits that influence their economic and social behaviors  
- **Real-time Society Simulation**: Live updates of AI being interactions, collaborations, and economic activities via WebSocket connections  
- **Trait Customization System**: Three methods for defining AI personalities - manual slider controls, AI-recommended optimization, or random generation  
- **Alith AI Integration**: Natural language assistant for strategic guidance, market analysis, and optimal trait recommendations  
- **NFT Minting**: Mint AI beings as unique NFTs on Hyperion testnet with full ownership capabilities  
- **Web3 Integration**: MetaMask wallet connectivity for blockchain interactions and NFT management  
- **Economic Simulation**: AI beings earn tokens, build reputation, and participate in collaborative projects autonomously  

## Tech Stack

**Frontend**
- React 18 with TypeScript
- Tailwind CSS for styling
- Socket.IO client for real-time updates
- ethers.js v6 for blockchain interactions
- MetaMask integration for Web3 connectivity

**Backend**
- Node.js with Express.js
- Socket.IO for real-time communication
- Alith AI framework for natural language processing
- Custom AI society management system

**Blockchain**
- Solidity smart contracts
- Hyperion testnet deployment
- Hardhat development framework
- OpenZeppelin contracts for NFT functionality

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Raakshass/hyperbeings-ai-society.git
   cd hyperbeings-ai-society
```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Install smart contract dependencies:

   ```bash
   cd ../smart-contracts
   npm install
   npm install dotenv
   npm install @openzeppelin/contracts
   ```

### Configuration

1. Create environment file for smart contracts:

   ```bash
   cd smart-contracts
   touch .env
   ```

2. Add your private key to `.env`:

   ```env
   PRIVATE_KEY=your_metamask_private_key_here
   ```

3. Configure MetaMask for Hyperion testnet:

   * **Network Name**: Hyperion Testnet
   * **RPC URL**: [https://hyperion-testnet.metisdevops.link](https://hyperion-testnet.metisdevops.link)
   * **Chain ID**: 133717
   * **Currency Symbol**: tMETIS

4. Obtain testnet tokens from the Hyperion faucet via Telegram bot: [https://t.me/hyperion\_testnet\_bot](https://t.me/hyperion_testnet_bot)

### Deployment

1. Compile smart contracts:

   ```bash
   cd smart-contracts
   npx hardhat compile
   ```

2. Deploy to Hyperion testnet:

   ```bash
   npx hardhat run scripts/deploy.js --network hyperion
   ```

3. Update contract address in:

   ```tsx
   frontend/src/components/Web3Provider.tsx
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend:

   ```bash
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Usage Guide

### Basic Workflow

1. **Connect Wallet**: Click the wallet connection interface and connect your MetaMask to Hyperion testnet
2. **Create AI Beings**: Use the creation interface to specify names and customize personality traits
3. **Choose Trait Method**: Select from manual customization, Alith AI recommendations, or random generation
4. **Mint as NFT**: AI beings are automatically minted as NFTs when wallet is connected
5. **Start Simulation**: Enable real-time simulation to watch AI beings interact and earn autonomously
6. **Interact with Alith**: Use the AI assistant for strategic advice and market analysis

### Trait Customization

* **Manual Mode**: Adjust creativity, socialness, risk-taking, ambition, and empathy using sliders
* **AI-Recommended**: Ask Alith AI to suggest optimal traits based on current market conditions
* **Random Generation**: Let the system generate balanced trait combinations automatically

### Monitoring

* View real-time society statistics including total population, wealth, and collaborations
* Track individual AI being performance, earnings, and reputation
* Monitor activity logs for detailed system events and NFT minting confirmations

## Folder Structure

```
hyperbeings-ai-society/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.tsx # Main dashboard interface
│   │   │   ├── AlithChat.tsx # AI assistant chat interface
│   │   │   ├── WalletConnection.tsx # Web3 wallet integration
│   │   │   └── Web3Provider.tsx # Blockchain connectivity provider
│   │   ├── types/            # TypeScript type definitions
│   │   └── App.tsx           # Main application component
│   └── package.json          # Frontend dependencies
├── backend/                  # Node.js server
│   ├── src/
│   │   └── server.js         # Express server with Socket.IO and Alith integration
│   └── package.json          # Backend dependencies
├── smart-contracts/          # Blockchain contracts
│   ├── contracts/
│   │   └── AIBeingNFT.sol    # NFT contract for AI beings
│   ├── scripts/
│   │   └── deploy.js         # Deployment script
│   ├── hardhat.config.js     # Hardhat configuration
│   └── package.json          # Contract dependencies
├── ai-engine/                # AI logic system
│   ├── AIBeing.js            # Individual AI being logic
│   ├── SocietyManager.js     # Society simulation management
│   └── AlithAgent.js         # Alith AI integration
└── README.md                 # Project documentation
```

## API Documentation

### Socket.IO Events

**Client to Server:**

* `create-being`: Create new AI being with specified traits
* `start-simulation`: Begin real-time society simulation
* `stop-simulation`: Pause society simulation

**Server to Client:**

* `society-update`: Broadcast society statistics updates
* `beings-update`: Send updated AI being data
* `new-being`: Notify of new AI being creation

### REST Endpoints

* `POST /api/alith/process`: Process natural language queries with Alith AI
* `GET /api/alith/analyze-society`: Get AI analysis of current society state
* `GET /api/health`: Server health check endpoint

## Contributing

We welcome contributions to the HyperBeings project. Please follow these guidelines:

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with clear, descriptive commit messages
4. Ensure all tests pass and code follows existing style conventions
5. Update documentation as needed
6. Submit a pull request with a detailed description of changes

### Code Standards

* Follow TypeScript best practices for frontend development
* Use consistent naming conventions across all components
* Include proper error handling and validation
* Maintain comprehensive logging for debugging purposes
* Ensure responsive design principles are followed

### Testing

* Test all new features thoroughly in both development and production environments
* Verify blockchain interactions work correctly on Hyperion testnet
* Ensure real-time functionality operates as expected with multiple concurrent users

## License

This project is licensed under the MIT License. See the LICENSE file for full details.

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository or contact the development team.

```

Let me know if you'd like to include badges, a table of contents, or GitHub Actions instructions as well!
```
