import { run } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

async function main() {
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
  const merkleRoot = "0x" + merkleTree.getRoot().toString("hex");

  const contractAddress = "0x9e7E48707cf39514DADB48b6fc9716f6ee7cC94b";
  const nftAddress = "0x54d037127BC8f2fEf32C3febDe268618596A07e9";
  const helperAddress = "0xb5d726FDAC02ab0e04fa5799DccC31b7aA2a9e6E";
  const whitelistEndTime = 1754000700; // Cập nhật theo script deploy
  const price = "100000000000000"; // 0.0001 ETH
  const maxSupply = 20;
  const maxPerWallet = 3;

  const args = [
    nftAddress,
    helperAddress,
    merkleRoot,
    whitelistEndTime,
    price,
    maxSupply,
    maxPerWallet,
  ];

  console.log("Verifying WhitelistSale with args:\n", args);

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: args,
  });

  console.log("WhitelistSale verified successfully");
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
