// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract VIPNFT is ERC1155 {
    uint256 public MAX_SUPPLY = 20;
    uint256 public minted = 0;
    string public name = "Fan Token for GRA Art Gallery"; // for OpenSea to show instead of unidentified contract


    constructor()
        ERC1155(
            "ipfs://QmSPAsBPprhrdvLm1yq8G5upY2EpSZTrcpPdL6ic6dfinE/{id}"
        )
    {
        
        mint(address(0x3A3593B8e169236289Cf8699876A8Af393B02230));
        mint(address(0x73382d70c64b527a7652Eb21C48bfc1eD2B6E0b6));
        mint(address(0x21586e20921f2d6C068830C9460c728c9a3411a2));
        mint(address(0xCAAE7Ee609621f5B64d7553fdee4696B2a4Eb56F));
    }

    function mint(address buyer) public payable {
        //require(id <= 1, "Token doesn't exist");
        //require(id > 0, "Token doesn't exist");
        //require(msg.value >= (amount * mintRate), "Not enough ether sent");
        require(minted < MAX_SUPPLY, "not enough supply left"); // fyi ERC1155 by default no limit and minting not allowed

        minted++;
        _mint(buyer, 1, 1, ""); // id 1, amount to mint is 1
    }
}
