require("dotenv").config()
const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")
const JWT = process.env.PINATA_JWT

const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "./assets/<your img>.png";
    const file = fs.createReadStream(src)
    formData.append("file", file)
    const pinataMetadata = JSON.stringify({
        name: "<your img name>",
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    })
    formData.append("pinataOptions", pinataOptions);
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

pinFileToIPFS()
