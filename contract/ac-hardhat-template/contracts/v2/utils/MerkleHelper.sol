// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleHelper {
    function verify(bytes32[] calldata proof, bytes32 root, address user) external pure returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(user));
        return MerkleProof.verify(proof, root, leaf);
    }
}