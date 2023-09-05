// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Painting is ERC721 {
    uint256 public cost = 0.001 ether; // mint price, will reject if below
    uint256 public maxSupply = 20;
    uint256 public totalSupply = 0;

    struct Paint {
        string name;
        address owner;
        uint256 list_price; // 0 means not listed by owner
    }

    Paint[] public paintings;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        _cost = cost;         

        paintings.push(Paint("Life Is Good", address(0x0), 0));
        paintings.push(Paint("Adventures Await", address(0x0), 0));
        paintings.push(Paint("Journey On", address(0x0), 0));
        paintings.push(Paint("Speed Up", address(0x0), 0));
        paintings.push(Paint("Lucky", address(0x0), 0));
    }
    function _baseURI() internal pure override returns (string memory) {
        return "https://raw.githubusercontent.com/cragtlab/gra-art/main/src/metadata/";
    }

    function mint(uint256 _id) public payable {
        uint256 supply = totalSupply;
        require(supply <= maxSupply);
        require(paintings[_id - 1].owner == address(0x0));
        require(msg.value >= cost);

        // NOTE: tokenID always starts from 1, but our array starts from 0
        paintings[_id - 1].owner = msg.sender;
        totalSupply = totalSupply + 1;
        _safeMint(msg.sender, _id);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update ownership
        paintings[tokenId - 1].owner = to;
        _transfer(from, to, tokenId);
    }

    function listToken(uint256 _id, uint256 list_price) public {
        require(_isApprovedOrOwner(_msgSender(), _id),
            "ERC721: transfer caller is not owner nor approved"
        );        
        paintings[_id - 1].list_price = list_price;
    }

    function buyToken(uint256 _id) external payable {
        //require(paintings[_id - 1].owner != address(0x0));
        require(paintings[_id - 1].list_price > 0);
        require(msg.value >= paintings[_id - 1].list_price);
                
        _transfer(paintings[_id - 1].owner, msg.sender, _id); // transfer token
        address payable _owner = payable(paintings[_id - 1].owner); 
        _owner.transfer(msg.value);  // pay money to seller        
        paintings[_id - 1].owner = msg.sender; // change ownership after all done. must be after transfer
        paintings[_id - 1].list_price = 0;     
    }


    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        // Update Building ownership
        paintings[tokenId - 1].owner = to;
        _safeTransfer(from, to, tokenId, _data);
    }

    // Public View Functions
    function getPaintings() public view returns (Paint[] memory) {
        return paintings;
    }

    function getPainting(uint256 _id) public view returns (Paint memory) {
        return paintings[_id - 1];
    }
}
