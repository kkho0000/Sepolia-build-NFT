// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
contract MyNFT is ERC1155URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // 这里面替换为已经上传Pinata的metadata的url
    // 我用的是 https://rose-electric-panda-281.mypinata.cloud/ipfs/QmXmVqM8Aum1pxAmTHRDuoAmQsxkS6e6NBz9THMJNp1WL4
    constructor()
        ERC1155(
            ""
        )
    {}
    function mintNFT(
        address recipient,
        uint256 amount,
        bytes memory data
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId, amount, data);
        return newItemId;
    }
}
