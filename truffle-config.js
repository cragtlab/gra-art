const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
	networks: {
		development: {
			host: "127.0.0.1",
			port: 7545,
			network_id: "*" // Match any network id
		}, // https://chainlist.org/chain/80001
		matic: {
			provider: () => new HDWalletProvider("XXXX1", `https://rpc-mumbai.maticvigil.com`),
			network_id: 80001,
			confirmations: 2,
			timeoutBlocks: 200,
			skipDryRun: true,
			networkCheckTimeout: 10000,
			gasPrice: 45000000000,

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
				runs: 200
			}
		}
	}
}