import "@nomicfoundation/hardhat-ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Counter } from "../typechain";

describe("Counter", function () {

  let deployer: SignerWithAddress,
    admin: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress,
    addr3: SignerWithAddress,
    addr4: SignerWithAddress,
    addr5: SignerWithAddress,
    addr6: SignerWithAddress,
    addr7: SignerWithAddress,
    addr8: SignerWithAddress,
    addr9: SignerWithAddress;

  let counter: Counter;

  const deploy = async () => {
    [deployer, admin, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9] = await ethers.getSigners();

    // deploy Counter contract
    counter = await (await ethers.getContractFactory("Counter")).deploy();
  };


  before(async () => {
    console.log("Deploying Counter contract...");
    await deploy();
  });

  describe("Deployment", function () {

    it("Should set the initial count to 0", async function () {
      const count = await counter.getCount();
      expect(count).to.equal(0n);
    });

  });

  describe("Increment", function () {

    it("Should increment the count by 1", async function () {
      const tx = await counter.increment();
      await tx.wait();

      const count = await counter.getCount();
      expect(count).to.equal(1n);
    });

  });
});
