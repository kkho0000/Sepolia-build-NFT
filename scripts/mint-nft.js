require("dotenv").config()
const RPC_URL = process.env.RPC_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const { Web3 } = require("web3");
const web3 = new Web3(RPC_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
console.log("ABI: ", JSON.stringify(contract.abi))

const contractAddress = "<your contract address>"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest")
    const tx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        gasPrice: await web3.eth.getGasPrice(),
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
        .then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on("transactionHash", (hash) => {
                    console.log("The Transaction Hash of the Contract deployed: ", hash)
                })
        })
        .catch((error) => {
            console.log("Promise failed:", error)
        })
}
mintNFT("https://ipfs.io/ipfs/<your cid>")