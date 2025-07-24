import { run } from "hardhat";

async function main() {
  const contractAddress = "0x54d037127BC8f2fEf32C3febDe268618596A07e9";

  const args = [
    "MyNFT", // name
    "MNFT",  // symbol
    "https://687144367ca4d06b34b9e592.mockapi.io/metadata/" // baseURI
  ];

  await run("verify:verify", {
    address: contractAddress,
    constructorArguments: args,
  });

  console.log("NFT verified successfully");
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
