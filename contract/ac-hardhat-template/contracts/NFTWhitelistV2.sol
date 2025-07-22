// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract NFTMerkleWhitelist is ERC721, Ownable {
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public totalSupply;
    string public baseURI;

    bytes32 public merkleRoot;
    mapping(address => uint256) public mintedPerWallet;

    event Minted(address indexed user, uint256 amount);
    event Withdrawn(uint256 amount);
    event MerkleRootUpdated(bytes32 newRoot);
    event CostUpdated(uint256 newCost);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event MaxPerWalletUpdated(uint256 newMaxPerWallet);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _maxPerWallet,
        string memory initialBaseURI,
        bytes32 _merkleRoot
    ) ERC721(name, symbol) Ownable(msg.sender) {
        cost = _cost;
        maxSupply = _maxSupply;
        maxPerWallet = _maxPerWallet;
        baseURI = initialBaseURI;
        merkleRoot = _merkleRoot;
    }

    // ----------------------
    // ADMIN FUNCTIONS
    // ----------------------

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit MerkleRootUpdated(_merkleRoot);
    }

    function setCost(uint256 _cost) external onlyOwner {
        cost = _cost;
        emit CostUpdated(_cost);
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        require(_maxSupply >= totalSupply, "Cannot set lower than current supply");
        maxSupply = _maxSupply;
        emit MaxSupplyUpdated(_maxSupply);
    }

    function setMaxPerWallet(uint256 _maxPerWallet) external onlyOwner {
        maxPerWallet = _maxPerWallet;
        emit MaxPerWalletUpdated(_maxPerWallet);
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdrawn(balance);
    }

    // ----------------------
    // PUBLIC MINT FUNCTION
    // ----------------------

    function mint(uint256 amount, bytes32[] calldata merkleProof) external payable {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply + amount <= maxSupply, "Exceeds max supply");
        require(mintedPerWallet[msg.sender] + amount <= maxPerWallet, "Exceeds max per wallet");
        require(msg.value >= cost * amount, "Insufficient ETH");

        // Verify Merkle Proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid Merkle Proof");

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
}
