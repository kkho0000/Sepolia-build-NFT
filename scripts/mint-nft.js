require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// 连接到以太坊节点
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// 使用私钥创建钱包
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

// 读取合约ABI和地址
const contractABIPath = path.join(__dirname, "../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractABI = JSON.parse(fs.readFileSync(contractABIPath, "utf8"));
const contractAddress = "0xC4326B0D9531050Ec8bc54e7d641654A79C6BBFe"; // 部署后得到的合约地址

// 创建合约实例
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

async function mintNFT(recipient, amount, data) {
    try {
        // 调用合约的mintNFT函数
        const tx = await contract.mintNFT(recipient, amount, data);
        console.log("Transaction hash:", tx.hash);

        // 等待交易被确认
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
}

// 示例调用
const recipient = process.env.PUBLIC_KEY; // 接收者的地址
const amount = 1; // 铸造的数量
const data = ethers.utils.toUtf8Bytes("Additional data"); // 示例数据

mintNFT(recipient, amount, data);