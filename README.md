# Metaverse Tutorial

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Web3](https://web3js.readthedocs.io/en/v1.5.2/) (Blockchain Interaction)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) (Development Framework)
- [Ganache](https://www.trufflesuite.com/ganache) (For Local Blockchain)
- [MetaMask](https://metamask.io/) (Ethereum Wallet)
- [ThreeJS](https://threejs.org/docs/index.html) (3D Javascript library)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), I recommend using node version v14 or v16 to avoid any potential dependency issues
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview), In your terminal, you can check to see if you have truffle by running `truffle --version`. To install truffle run `npm i -g truffle`.
- Install [Ganache](https://www.trufflesuite.com/ganache).
- Install [MetaMask](https://metamask.io/) in your browser.

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install `

### 2a. Install Ganache and Truffle
npm install -g truffle

### 2a. Run Ganache
npx ganache-cli
* Make sure the chainId matches your Land.js, and port match the truffle-config.js
* Import the private key into your metamask for the 100 ETH 

### 3. Migrate Smart Contracts
`$ truffle migrate --reset`
* If error with json, can delete all except Address.json and Land.json

### 4. Test Smart Contracts
`$ truffle test`

### 5. Start Frontend
`$ npm start`  
`$ npm run web`

### 6. Update Metamask Network 
For Ganache
* Add local Ganache https://chainlist.org/?search=ganache&testnets=true
* Import private keys of ganache server into metamask
For Polygon Testnet
* npx truffle migrate --reset --network matic
* npx truffle migrate --reset --network matic --compile-none (if got 32603 error with above)
* Open index.html with Live Server  (npx run web)
* Add Polygon Mumbai testnet https://chainlist.org/chain/80001
For Source Code Verification to interact with contract via Polygon (e.g. withdraw money in contract out)
* npm install truffle-plugin-verify
* npx truffle run verify Painting --network matic --debug
