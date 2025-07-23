// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MintConfig is Ownable {
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public whitelistEndTime;
    bytes32 public merkleRoot;

    event MerkleRootUpdated(bytes32 newRoot);
    event CostUpdated(uint256 newCost);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event MaxPerWalletUpdated(uint256 newMaxPerWallet);
    event WhitelistEndTimeUpdated(uint256 newEndTime);

    constructor(
        address initialOwner,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _maxPerWallet,
        bytes32 _merkleRoot,
        uint256 _whitelistEndTime
    ) Ownable(initialOwner) {
        cost = _cost;
        maxSupply = _maxSupply;
        maxPerWallet = _maxPerWallet;
        merkleRoot = _merkleRoot;
        whitelistEndTime = _whitelistEndTime;
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit MerkleRootUpdated(_merkleRoot);
    }

    function setCost(uint256 _cost) external onlyOwner {
        cost = _cost;
        emit CostUpdated(_cost);
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
        emit MaxSupplyUpdated(_maxSupply);
    }

    function setMaxPerWallet(uint256 _maxPerWallet) external onlyOwner {
        maxPerWallet = _maxPerWallet;
        emit MaxPerWalletUpdated(_maxPerWallet);
    }

    function setWhitelistEndTime(uint256 _whitelistEndTime) external onlyOwner {
        whitelistEndTime = _whitelistEndTime;
        emit WhitelistEndTimeUpdated(_whitelistEndTime);
    }
}