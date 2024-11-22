# Sepolia-build-NFT
**相关网站：**

[MetaMask 你的ETH账户](https://metamask.io/)

[Sepolia Testnet Explorer 用来搜索一些地址](https://sepolia.etherscan.io/)

[Sepolia 水龙头，充点代币](https://sepolia-faucet.pk910.de/)

[用来查找附近的服务器](https://chainlist.org/chain/11155111)



## 0. 创建一个MetaMask账户，并获取一些测试代币

1. [在这个网址上面注册](https://metamask.io/)，这个账户可以直接作为浏览器（比如Chrome）插件使用
2. 左上角将网络切换为Sepolia
3. 在[Sepolia 水龙头](https://sepolia-faucet.pk910.de/)上面，先进入[Gitcoin Passport](https://passport.gitcoin.co/#/) ，通过MetaMask账户登入，然后绑定Chrome账号、LinkedIn账号和Discord后。回到水龙头界面，可以“挖”一些测试代币出来。

---

## 1. 项目初始化

在这个项目的根目录，当然首先要有node环境。

```cmd
npm install
npx hardhat
```

在根目录创建一个`.env`文件，写入以下内容：

```properties
# 在https://chainlist.org/chain/11155111上面搜索一个可以用的url，填到下面
# 我用的是https://ethereum-sepolia-rpc.publicnode.com
RPC_URL="<your url>"
PUBLIC_KEY="<写你的MetaMask账户，0x开头的那个>"
PRIVATE_KEY="<MetaMask账户的私钥密码>"
```

为了检查现在配置的对不对，可以在终端运行一下这个

```cmd
node scripts/check-balance.js
```

如果正确显示了账户的余额，则成功。然后运行编译：

```cmd
npx hardhat compile
```

如果显示`Compiled 18 Solidity files successfully (evm target: istanbul).`则成功。

---

## 3. 部署ERC-1155智能合约

```cmd
npx hardhat --network sepolia run scripts/deploy.js
```

会输出一个contract地址，记得保存。将这个地址代码，放到[sepolia.etherscan.io](https://sepolia.etherscan.io/)上面搜索，如果下面的Transaction能找到就成功了。

---

## 4. 上传我们的asset到IPFS上

首先在[Pinata](https://app.pinata.cloud/)上创建账户，然后左侧API Keys一栏点进去，创建一个新的API，保存JWT那一项，写到项目.env中。

```properties
# .env
PINATA_JWT="<your JWT>"
```

在项目`assets`文件夹中，放入一张png格式的图片，推荐像素`350*350`。

在`/scripts`中找到`pinFileTOIPFS.js`，替换图片的地址和名字。运行pinFileToIPFS，将图片上传到IPFS上：

```cmd
node scripts/pinFileTOIPFS.js
```

会输出IpfsHash，称其为CID，将其保存。

然后在这个文件夹中添加一个`nft-metadata.json`文件，写入以下内容：

```json
{
    "description": "<replace the description>",
    "image": "https://ipfs.io/ipfs/<replace the CID>",
    "name": "<replace the name>"
}
```

修改`pinFileTOIPFS.js`脚本：

```js
const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "./assets/nft-metadata.json";
    const file = fs.createReadStream(src)
    formData.append("file", file)
    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                "Authorization": `Bearer ${JWT}`
            }
        });
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}
```

再次运行，上传json文件到ipfs。

---

## 5. 铸造NFT

替换`/scripts/mint-nft.js`脚本中的`contrastAddress`和最后一行的`cid`，分别是第3步中智能合约的地址和上一步上传图片时得到的cid(不是上传json文件时的)。

运行：

```cmd
node .\scripts\mint-nft.js
```

NFT铸造成功，会输出一个地址，然后在[sepolia.etherscan.io](https://sepolia.etherscan.io/)上面，搜索这个地址。找到interacted with(To)这一栏，复制这个内容，再记一下id。我们要把这个NFT手动添加到账户中，打开MetaMask界面，点击导入，将刚刚复制的地址粘贴进去，然后填写id。

若导入成功，在Opensea上连接我们的MetaMask账户，就可以看到铸造好的NFT了。
