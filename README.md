# TicketChain

## Project Description

TicketChain is a blockchain-based decentralized application (DApp) designed for secure and transparent ticket selling. By leveraging smart contracts on the Ethereum blockchain, TicketChain allows event organizers to sell tickets as non-fungible tokens (NFTs), ensuring authenticity and eliminating ticket fraud. Users can buy tickets using Ethereum through MetaMask, select their seats directly from the application, and enjoy a seamless purchasing experience. Each ticket is tied to a specific wallet, and all transactions are recorded on the blockchain for transparency and security.

Key features include:
- **Ownership**: Tickets are sold as NFTs, ensuring that each ticket is unique and cannot be duplicated.
- **Transparency**: All transactions are recorded on the blockchain, ensuring transparency for buyers and sellers.
- **Instant Payments**: Funds are instantly transferred to the event organizer via smart contracts, reducing intermediaries and transaction fees.
- **Seat Selection**: Users can choose their seats in real time during the purchasing process.
- **Decentralization**: The platform ensures that no single entity controls the ticketing process, reducing the risks of centralized systems.

TicketChain provides a trustless, decentralized solution for managing ticket sales, ensuring a fair and efficient ticketing system for all participants.


## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [MetaMask](https://metamask.io/)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). Recommended to use the LTS version.
- Install [MetaMask](https://metamask.io/) on your browser.

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend
`$ npm run start`