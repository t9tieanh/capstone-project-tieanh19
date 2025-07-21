import { run } from "hardhat";

export default async function main() {
  const contractAddress = "0x59bA0667668C9Ac5F3C8FEE88E522554778688c3"; 

  const constructorArgs = [
    "Whitelist_NFT",                          // name
    "WLNFT",                                  // symbol
    "100000000000000",                        // cost = 0.0001 ETH = 10^14 wei
    20,                                       // maxSupply
    3,                                        // maxPerWallet
    "https://687144367ca4d06b34b9e592.mockapi.io/metadata/" // baseURI
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
