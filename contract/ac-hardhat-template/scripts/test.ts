import { ethers } from "hardhat";
import { Counter } from "../typechain";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);

  const counter: Counter = await ethers.getContract("Counter");
  const tx = await counter.increment();
  await tx.wait();

  const count = await counter.getCount();
  console.log("Current count is:", count.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
