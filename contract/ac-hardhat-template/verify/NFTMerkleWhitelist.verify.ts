import { run } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

async function main() {
  // 1. Danh sách whitelist (phải giống với file deploy)
  const whitelistAddresses = [
    "0x3d6a96d41f4331B97A814CEF25407278b79e3BE8",
    "0x94337fc24282E73C298D173ecAe43B4ef2B1074d",
    "0x65cFbdF39A00a183c874ddf1e01B6d0B554BA3Ba",
    "0x9D03A5a01DDe849503fc7C759672048E990E71Ec"
  ];

  const leafNodes = whitelistAddresses.map(addr =>
    keccak256(addr.toLowerCase())
  );
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const rootFormatted = "0x" + merkleRoot;

  const contractAddress = "0xf2F4de35844474E6EbED57E257d9AE0f7BffF9D3";

  const args = [
    "Merkle Whitelist NFT",                                // name
    "MWLNFT",                                               // symbol
    "100000000000000",                                      // cost (0.0001 ETH in wei)
    20,                                                     // maxSupply
    3,                                                      // maxPerWallet
    "https://687144367ca4d06b34b9e592.mockapi.io/metadata/",// baseURI
    rootFormatted                                           // merkleRoot
  ];

  console.log("Verifying contract with arguments:\n", args);

  // 4. Verify contract using Hardhat Etherscan plugin
  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: args
  });

  console.log("Verified successfully!");
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
