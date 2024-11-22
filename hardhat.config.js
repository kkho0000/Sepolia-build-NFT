/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
};

/**
* @type import("hardhat/config").HardhatUserConfig
*/
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { RPC_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.1",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}
