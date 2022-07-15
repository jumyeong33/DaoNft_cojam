require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const HDWalletProviderKlaytn = require("truffle-hdwallet-provider-klaytn");
const {
  INFURA_KEY,
  PRIVATE_KEY_ETH,
  PRIVATE_KEY_CYPRESS,
  PRIVATE_KEY_BAOBAB,
  PRIVATE_KEY_BSCTEST,
  PRIVATE_KEY_BSC,
} = process.env;

module.exports = {
  plugins: ["solidity-coverage"],
  networks: {
    mainnet: {
      provider: () => {
        return new HDWalletProvider(
          PRIVATE_KEY_ETH,
          `https://mainnet.infura.io/v3/${INFURA_KEY}`
        );
      },
      port: 8545,
      network_id: 1,
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(
          PRIVATE_KEY_ETH,
          `https://ropsten.infura.io/v3/${INFURA_KEY}`
        );
      },
      port: 8545,
      network_id: "3",
      skipDryRun: true,
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(
          PRIVATE_KEY_ETH,
          `https://rinkeby.infura.io/v3/${INFURA_KEY}`
        );
      },
      port: 8545,
      network_id: "4",
      skipDryRun: true,
    },
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
    bscTestnet: {
      provider: () => {
        return new HDWalletProvider(
          PRIVATE_KEY_BSCTEST,
          `https://data-seed-prebsc-1-s1.binance.org:8545/`
        );
      },
      port: 8545,
      network_id: 97,
      gas: 5500000,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bscMainnet: {
      provider: () => {
        return new HDWalletProvider(
          PRIVATE_KEY_BSC,
          `https://bsc-dataseed.binance.org`
        );
      },
      port: 8545,
      network_id: 56,
      gas: 6000000000,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    baobab: {
      provider: () =>
        new HDWalletProviderKlaytn(
          PRIVATE_KEY_BAOBAB,
          "https://api.baobab.klaytn.net:8651"
        ),
      network_id: 1001, //Klaytn baobab testnet's network id
      gas: 8500000,
      gasPrice: null,
    },
    cypress: {
      provider: () =>
        new HDWalletProviderKlaytn(
          PRIVATE_KEY_CYPRESS,
          "https://kaikas.cypress.klaytn.net:8651"
        ),
      network_id: 8217, //Klaytn mainnet's network id
      gas: 8500000,
      gasPrice: null,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        // evmVersion: "", //basically verstion defult, petersburg, istanbul use petersburg for klaytn
      },
    },
  },
};
