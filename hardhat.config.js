require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

const { PRIVATE_KEY, ALCHEMY_SEPOLIA_API_URL } = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
