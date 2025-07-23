// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MintConfig.sol";
import "./utils/MerkleHelper.sol";

contract NFTMerkleWhitelistV2 is ERC721, Ownable, ReentrancyGuard {
    MintConfig public config;
    MerkleHelper public helper;

    uint256 public totalSupply;
    string public baseURI;
    mapping(address => uint256) public mintedPerWallet;

    event Minted(address indexed user, uint256 amount);
    event Withdrawn(uint256 amount);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory name,
        string memory symbol,
        address configAddress,
        address _helper,
        string memory _initialBaseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        config = MintConfig(configAddress);
        baseURI = _initialBaseURI;
        helper = MerkleHelper(_helper); 
    }

    // ----------------------
    // ADMIN FUNCTIONS
    // ----------------------

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawn(balance);
    }

    // ----------------------
    // PUBLIC MINT FUNCTION
    // ----------------------

    function mint(uint256 amount, bytes32[] calldata merkleProof) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply + amount <= config.maxSupply(), "Exceeds max supply");
        require(mintedPerWallet[msg.sender] + amount <= config.maxPerWallet(), "Exceeds max per wallet");
        

        // If whitelist is active
        if (block.timestamp <= config.whitelistEndTime()) {
            require(helper.verify(merkleProof, config.merkleRoot(), msg.sender), "Invalid Merkle Proof");
            require(msg.value == 0, "Whitelist mint is free");
        } else {
             require(msg.value >= config.cost() * amount, "Insufficient ETH for public sale");
        }

        for (uint256 i = 0; i < amount; i++) {
            totalSupply++;
            _safeMint(msg.sender, totalSupply);
        }

        mintedPerWallet[msg.sender] += amount;
        emit Minted(msg.sender, amount);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function owner() public view override(Ownable) returns (address) {
        return super.owner();
    }
}