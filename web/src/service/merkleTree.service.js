import keccak256 from 'keccak256';
import { MerkleTree } from 'merkletreejs';
import whiteList from './whitelist.json'

import { Buffer } from 'buffer';
window.Buffer = Buffer;

class MerkleTreeService {
  constructor(whitelistAddresses) {
    this.whitelistAddresses = whitelistAddresses.map((addr) => addr.toLowerCase());
    const leafNodes = this.whitelistAddresses.map((addr) => keccak256(addr));
    this.merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  }

  getHexRoot() {
    return this.merkleTree.getHexRoot();
  }

  getProof(address) {
    const leaf = keccak256(address.toLowerCase());
    return this.merkleTree.getHexProof(leaf);
  }

  verify(address, proof) {
    const leaf = keccak256(address.toLowerCase());
    return this.merkleTree.verify(proof, leaf, this.getHexRoot());
  }
}

const merkleTreeService = new MerkleTreeService(whiteList)

export default merkleTreeService