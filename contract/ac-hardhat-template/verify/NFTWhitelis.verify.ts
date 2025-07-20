import { run } from "hardhat";

export default async function main() {
  const contractAddress = "0x7226460fcdf12c6f5dbfd2596E6a2e6EF8f4eEe6";

  const constructorArgs = [
    "NFT Game",  // name
    "NFTG"       // symbol
  ];

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
    });
    console.log("Verify completed!");
  } catch (error) {
    console.error("Verify failed:", error);
    process.exit(1);
  }
}

main();
