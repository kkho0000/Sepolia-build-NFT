require("dotenv").config()
const RPC_URL = process.env.RPC_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const { Web3 } = require("web3");
const web3 = new Web3(RPC_URL)
const address = PUBLIC_KEY
async function checkBalance() {
    const balance = await web3.eth.getBalance(address);
    const etherBalance = web3.utils.fromWei(balance, "ether");
    console.log("Balance: ", etherBalance)
}
checkBalance()