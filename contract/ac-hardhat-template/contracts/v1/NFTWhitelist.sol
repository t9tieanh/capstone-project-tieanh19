// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTWhitelist is ERC721, Ownable, ReentrancyGuard {
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public totalSupply;
    string public baseURI;

    mapping(address => bool) private whitelisted;
    mapping(address => uint256) private mintedPerWallet;

    event Minted(address indexed user, uint256 amount);
    event AddedToWhitelist(address indexed user);
    event RemovedFromWhitelist(address indexed user);
    event Withdrawn(uint256 amount);
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
        string memory initialBaseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        cost = _cost;
        maxSupply = _maxSupply;
        maxPerWallet = _maxPerWallet;
        baseURI = initialBaseURI;
        totalSupply = 0;
    }

    modifier onlyWhitelisted() {
        require(whitelisted[msg.sender], "Not whitelisted");
        _;
    }

    // ----------------------
    // ADMIN FUNCTIONS
    // ----------------------

    function addToWhitelist(address user) external onlyOwner {
        whitelisted[user] = true;
        emit AddedToWhitelist(user);
    }

    function removeFromWhitelist(address user) external onlyOwner {
        whitelisted[user] = false;
        emit RemovedFromWhitelist(user);
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

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
        emit Withdrawn(balance);
    }

    // ----------------------
    // PUBLIC FUNCTIONS
    // ----------------------

    function mint(uint256 amount) external payable onlyWhitelisted {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply + amount <= maxSupply, "Exceeds max supply");
        require(mintedPerWallet[msg.sender] + amount <= maxPerWallet, "Exceeds max per wallet");
        require(msg.value >= cost * amount, "Insufficient ETH");

        for (uint256 i = 0; i < amount; ) {
            _safeMint(msg.sender, totalSupply);
            unchecked {
                totalSupply++;
                i++;
            }
        }

        mintedPerWallet[msg.sender] += amount;
        emit Minted(msg.sender, amount);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // ----------------------
    // VIEW HELPERS
    // ----------------------

    function isWhitelisted(address user) external view returns (bool) {
        return whitelisted[user];
    }

    function mintedBy(address user) external view returns (uint256) {
        return mintedPerWallet[user];
    }
}
