// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // 1-to-1 NFT
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract Painting is ERC721Royalty {
    uint256 public cost = 0.001 ether; // mint price, will reject if below
    uint256 public maxSupply = 20;
    uint256 public totalSupply = 0;
    address public immutable contract_owner;

    struct Paint {
        string name;
        address owner;
        address creator;
        int256 list_price; // -1 means auction, 0 means not listed by owner
    }
    Paint[] public paintings;

    struct Bid {
        uint256 amount;
        address payable bidder;
    }
    // index of current auction
    uint256 auction_painting_id = 0; // 1-based, 0 meant no auction
    // bids are in ascending amount, i.e. last element is highest
    Bid[] public bids;
    uint auction_expiry_date;

    struct Name {
        string name;
        address wallet_address;
    }
    Name[] public names;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        _cost = cost;
        contract_owner = msg.sender; // security to restrict addPainting to only deployer
        address creator = address(0x3A3593B8e169236289Cf8699876A8Af393B02230);

        _setDefaultRoyalty(creator, 1000); // 10%

        addPainting("Life Is Good", creator, 0);
        addPainting("Adventures Await", creator, 0);
        addPainting("Journey On", creator, 0);
        addPainting("Evening Autumn (KY)", creator, 0);
        addPainting(
            "Fast Train",
            address(0x73382d70c64b527a7652Eb21C48bfc1eD2B6E0b6),
            0
        );

        addPainting("Maximum Throttle (MT)", creator, 0);
        addPainting("MBS (KS)", creator, 0);
        addPainting("Peekaboo", creator, 0);
        addPainting("Golden Moments", creator, 0);
        addPainting("Sunset", creator, 0);

        addPainting("Blossoms", creator, 0);
        addPainting(
            "Darkness",
            address(0x3A3593B8e169236289Cf8699876A8Af393B02230),
            0
        );
        addPainting("Bright", creator, 0);
        addPainting("Rainbow Tree", creator, 0);
        addPainting("Relax", creator, 0);

        addName(address(0x3A3593B8e169236289Cf8699876A8Af393B02230), "Van GRA");
        addName(address(0x73382d70c64b527a7652Eb21C48bfc1eD2B6E0b6), "lenovo");
        addName(address(0x21586e20921f2d6C068830C9460c728c9a3411a2), "sm");
        addName(address(0xCAAE7Ee609621f5B64d7553fdee4696B2a4Eb56F), "CC");
        addName(address(0xeC79fC264b134eA21161D7e1487676b8D26B6AE8), "Homely");
        /*
        paintings[0].owner=address(0xB793eca1c417B001fa2b82cc35f8488124C54F0e);
        paintings[0].list_price=-1; 
        auction_painting_id=1;
        auction_expiry_date=block.timestamp+30 minutes;
        */
    }

    function _baseURI() internal pure override returns (string memory) {
        //return "ipfs://QmXyoc8kwjUvPqgJP3kQeLiSGS4wFnHt78JPs9AsYepGHd/"; // works too but metamask somehow dont show the image when import even though confirm can fetch in background.html
        return "https://raw.githubusercontent.com/cragtlab/gra-art/main/src/metadata/";
    }

    /* name related */
    function addName(address walletAddress, string memory name) public {
        // self update or contract owner update
        require(
            msg.sender == walletAddress || msg.sender == contract_owner,
            "Permission denied"
        );
        bool found = false;
        for (uint256 i = 0; i < names.length; i++) {
            if (names[i].wallet_address == walletAddress) {
                names[i].name = name;
                found = true;
                break;
            }
        }

        if (!found) {
            names.push(Name(name, walletAddress));
        }
    }

    function getNames() public view returns (Name[] memory) {
        return names;
    }

    /* end name related */

    /* auction related  */
    function addBid(uint256 amount) public {
        require(auction_painting_id > 0); // ongoing auction
        require(auction_expiry_date >= block.timestamp); // not expired
        if (bids.length > 0) {
            require(amount > bids[bids.length - 1].amount);
        }
        if (auction_expiry_date - block.timestamp < 3 minutes) {
            auction_expiry_date = block.timestamp + 3 minutes;
        }

        bids.push(Bid(amount, payable(msg.sender)));
    }

    function getAuctionPaintingID() public view returns (uint256) {
        return auction_painting_id;
    }

    function getAuctionExpiryDate() public view returns (uint) {
        return auction_expiry_date;
    }

    function getBids() public view returns (Bid[] memory) {
        return bids;
    }

    // to be trigger by top bidder
    function payAuction() public payable returns (bool) {
        require(auction_painting_id > 0);
        require(block.timestamp > auction_expiry_date); // expired

        if (bids.length == 0) {
            auction_painting_id = 0;
            return false;
        }

        Bid memory highestBid = bids[bids.length - 1];
        require(msg.sender == highestBid.bidder);
        require(msg.value >= highestBid.amount);
        // to refactor out since also in buyToken?
        Paint memory auction = paintings[auction_painting_id - 1];
        _transfer(auction.owner, msg.sender, auction_painting_id); // transfer token
        address payable _owner = payable(auction.owner);
        _owner.transfer(msg.value); // pay money to seller
        // somehow painting owner and list price  didn't update when use auction variable instead
        paintings[auction_painting_id - 1].owner = msg.sender; // change ownership after all done. must be after transfer
        paintings[auction_painting_id - 1].list_price = 0;
        auction_painting_id = 0; //reset token
        return true;
    }

    /* end auction related */

    function addPainting(
        string memory _name,
        address creator,
        int256 list_price
    ) public {
        require(msg.sender == contract_owner);
        paintings.push(Paint(_name, address(0x0), creator, list_price));
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

    function listToken(uint256 _id, int256 list_price) public {
        require(
            _isApprovedOrOwner(_msgSender(), _id),
            "ERC721: transfer caller is not owner nor approved"
        );
        paintings[_id - 1].list_price = list_price;
        if (list_price < 0) {
            // should only allow by contract_owner to prevent abuse or clearing ongoing auction
            delete bids;
            auction_painting_id = _id;
            auction_expiry_date = block.timestamp + 5 minutes;
        }
    }

    function buyToken(uint256 _id) external payable {
        //require(paintings[_id - 1].owner != address(0x0));
        require(paintings[_id - 1].list_price > 0);
        require(msg.value >= uint256(paintings[_id - 1].list_price)); // convert to uint256 only after confirm > 0

        _transfer(paintings[_id - 1].owner, msg.sender, _id); // transfer token
        address payable _owner = payable(paintings[_id - 1].owner);
        _owner.transfer(msg.value); // pay money to seller
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

        // Update ownership
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

    /* withdraw money
    function withdraw() public payable{
        payable(msg.sender).transfer(address(this).balance);
    }*/
}
