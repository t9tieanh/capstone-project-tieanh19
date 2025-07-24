// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface INFT {
    function mint(address to, uint256 amount) external;
    function mintedPerWallet(address user) external view returns (uint256);
}

interface IMerkleHelper {
    function verify(bytes32[] calldata proof, bytes32 root, address user) external pure returns (bool);
}

contract WhitelistSale is Ownable {
    INFT public nft;
    IMerkleHelper helper;

    bytes32 public merkleRoot;
    uint256 public whitelistEndTime;
    uint256 public price;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public totalMinted;

    event Minted(address indexed user, uint256 amount);
    event ConfigUpdated();

    constructor(
        address _nftAddress,
        address _helper,
        bytes32 _merkleRoot,
        uint256 _whitelistEndTime,
        uint256 _price,
        uint256 _maxSupply,
        uint256 _maxPerWallet
    ) Ownable(msg.sender) {
        nft = INFT(_nftAddress);
        helper = IMerkleHelper(_helper);
        merkleRoot = _merkleRoot;
        whitelistEndTime = _whitelistEndTime;
        price = _price;
        maxSupply = _maxSupply;
        maxPerWallet = _maxPerWallet;
    }

    function whitelistMint(uint256 amount, bytes32[] calldata proof) external payable {
        require(amount > 0, "Invalid amount");
        require(totalMinted + amount <= maxSupply, "Max supply exceeded");
        require(nft.mintedPerWallet(msg.sender) + amount <= maxPerWallet, "Max per wallet exceeded");

        // If whitelist is active
        if (block.timestamp <= whitelistEndTime) {
            require(helper.verify(proof, merkleRoot, msg.sender), "Invalid Merkle Proof");
            require(msg.value == 0, "Whitelist mint is free");
        } else {
            require(msg.value >= price * amount, "Insufficient ETH");
        }

        totalMinted += amount;
        nft.mint(msg.sender, amount);
        emit Minted(msg.sender, amount);
    }

    // ----------------------
    // ADMIN FUNCTIONS
    // ----------------------

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit ConfigUpdated();
    }

    function setWhitelistEndTime(uint256 _whitelistEndTime) external onlyOwner {
        whitelistEndTime = _whitelistEndTime;
        emit ConfigUpdated();
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
        emit ConfigUpdated();
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
        emit ConfigUpdated();
    }

    function setMaxPerWallet(uint256 _maxPerWallet) external onlyOwner {
        maxPerWallet = _maxPerWallet;
        emit ConfigUpdated();
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
