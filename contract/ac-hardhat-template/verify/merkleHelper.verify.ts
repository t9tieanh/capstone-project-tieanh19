import { run } from "hardhat";

async function main() {
  const contractAddress = "0xb5d726FDAC02ab0e04fa5799DccC31b7aA2a9e6E";

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
  });

  console.log("MerkleHelper verified successfully");
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
