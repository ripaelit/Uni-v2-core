import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-contract-sizer";

// Import MNEMONIC or single private key
const MNEMONIC = process.env.MNEMONIC || "test test test test test test test test test test test junk";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const INFURA = process.env.INFURA || "";
const ETHEREUM_API_KEY = process.env.ETHEREUM_API_KEY || "api-key";
const OPTIMISM_API_KEY = process.env.OPTIMISM_API_KEY || "api-key";
const BSC_API_KEY = process.env.BSC_API_KEY || "api-key";
const FANTOM_API_KEY = process.env.FANTOM_API_KEY || "api-key";
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || "api-key";
const ARBITRUM_API_KEY = process.env.ARBITRUM_API_KEY || "api-key";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  // defaultNetwork: 'hardhat',
  // defaultNetwork: 'localhost',
  // defaultNetwork: 'polygonAmoy',
  defaultNetwork: 'polygon',
  solidity: {
    compilers: [{
      // version: '0.8.12', 
      version: '0.5.16', 
      settings: {
        optimizer: {
          enabled:true, 
          runs:300
        }
      }
    }],
    settings: {
      debug: {
        // Enable the debugger
        enabled: true,
        // Define the URL of the debugging server
        server: "http://127.0.0.1:8545",
        // Enable Solidity stack traces
        stacktrace: true,
        // Enable detailed errors
        verbose: true,
      },
    },
  },
  networks: {
    hardhat: {
      gas: 30e6,
      blockGasLimit: 30e6,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      gas: 30e6,
      blockGasLimit: 30e6,
      url: 'http://127.0.0.1:8545',
      loggingEnabled: true,
    },
    mainnet: {
      gasPrice: 'auto',
      url: 'https://mainnet.infura.io/v3/' + INFURA,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    sepolia: {
      url: 'https://sepolia.infura.io/v3/' + process.env.INFURA,
      chainId: 11155111,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    optimisticEthereum: {
      // url: 'https://optimism-mainnet.infura.io/v3/' + INFURA,
      url: 'https://mainnet.optimism.io',
      chainId: 10,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    optimismSepolia: {
      url: 'https://optimism-sepolia.blockpi.network/v1/rpc/public',
      chainId: 11155420,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    polygon: {
      url: 'https://polygon-mainnet.infura.io/v3/' + INFURA,
      chainId: 137,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    polygonMumbai: {
      url: 'https://polygon-mumbai.infura.io/v3/' + INFURA,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
      gasPrice: 80000000000,
    },
    polygonAmoy: {
      url: 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
      gasPrice: 30000000000,
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      //gasPrice: 5000000000,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
      chainId: 97,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    arbitrumOne: {
      // url: 'https://arbitrum-mainnet.infura.io/v3/' + INFURA,
      url: 'https://arb1.arbitrum.io/rpc',
      chainId: 42161,
      //gasPrice: 5000000000,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    arbitrumSepolia: {
      // gasPrice: 10000,
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
    ftmTestnet: {
      // url: `https://endpoints.omniatech.io/v1/fantom/testnet/public`,
      // url: `https://rpc.ankr.com/fantom_testnet`,
      url: `https://fantom-testnet.public.blastapi.io`,
      chainId: 4002,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    // not supported by default by hardhat
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
          // apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          // browserURL: "https://www.oklink.com/polygonAmoy"
        },
      },
      {
        network: 'optimismSepolia',
        chainId: 11155420,
        urls: {
          apiURL: 'https://api-sepolia-optimistic.etherscan.io/api',
          browserURL: 'https://sepolia-optimism.etherscan.io/',
        },
      },
      {
        network: 'arbitrumSepolia',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io/',
        },
      },
    ],
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      // Ethereum
      mainnet: ETHEREUM_API_KEY,
      sepolia: ETHEREUM_API_KEY,
      // Optimism
      optimisticEthereum: OPTIMISM_API_KEY,
      // optimismSepolia: OPTIMISM_API_KEY,
      // polygon
      polygon: POLYGON_API_KEY,
      polygonMumbai: POLYGON_API_KEY,
      polygonAmoy: POLYGON_API_KEY,
      // Arbitrum
      arbitrumOne: ARBITRUM_API_KEY,
      // arbitrumSepolia: ARBITRUM_API_KEY,
      // Bsc
      bsc: BSC_API_KEY,
      bscTestnet: BSC_API_KEY,
      // Fantom
      ftmTestnet: FANTOM_API_KEY,
      //
    },
  },
  mocha: {
    timeout: 40000000000000
  }
};

export default config;
