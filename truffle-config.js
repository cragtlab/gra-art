const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*" // Match any network id
		}, // https://chainlist.org/chain/80001

		sepolia: {
			provider: () => new HDWalletProvider("ebd336b425840ca7b2dc3c65fb6a23b361e64ac3a715751f60df357e56b8b3c2", 
			"https://ethereum-sepolia.publicnode.com"),    
			//"https://eth-sepolia-public.unifra.io"),
				//"wss://ethereum-sepolia.publicnode.com"),
			network_id: 11155111, // Sepolia's network ID
			//gas: 4000000, // Adjust the gas limit as per your requirements
			//gasPrice: 10000000000, // Set the gas price to an appropriate value
			confirmations: 2, // Set the number of confirmations needed for a transaction
			timeoutBlocks: 20, // Set the timeout for transactions
			skipDryRun: true // Skip the dry run option
		}



		, matic: {
			// login and get RPC from https://rpc.maticvigil.com/
			provider: () => new HDWalletProvider(
				 "722db7152fc524a2aea25f239db43c75ea3f132acb145036a5e523bbbf8070eb",
				//"ebd336b425840ca7b2dc3c65fb6a23b361e64ac3a715751f60df357e56b8b3c2", 
			// `wss://rpc-mumbai.maticvigil.com/ws/v1/9699793cf270b63215f6aa760a938012551a80b1`),
			`https://rpc-mumbai.maticvigil.com`),
			//"wss://polygon-mumbai-bor.publicnode.com"),
			//"https://endpoints.omniatech.io/v1/matic/mumbai/public"),
			network_id: 80001,
			confirmations: 2,
			timeoutBlocks: 200,
			skipDryRun: true,
			networkCheckTimeout: 10000,
			//gasPrice: 45000000000,
			//gasLimit: 45000000000,
			//gas: 700000,
			//gasPrice: 7000000000
			//gasPrice: 100000000000,
			//gas: 6721975

		},
	},

	contracts_directory: './src/contracts/',
	contracts_build_directory: './src/abis/',
	plugins: ['truffle-plugin-verify'],
	api_keys: {
		polygonscan: '5PB37NJQ9BMMMWCA6TTSRPSTXJJWNATMIM'
	},
	compilers: {
		solc: {
			version: '0.8.9',
			optimizer: {
				enabled: true,
				runs: 1500
			}
		}
	}
}