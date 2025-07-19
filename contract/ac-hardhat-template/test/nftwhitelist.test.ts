import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Basic NFT Mint Test", function () {
  async function deployFixture() {
    const [owner, user1] = await ethers.getSigners();

    const name = "NFT Game";
    const symbol = "NFTG";

    const NFTWhitelist = await ethers.getContractFactory("NFTWhitelist");
    const nft = await NFTWhitelist.deploy(name, symbol);
    await nft.waitForDeployment();

    const cost = await nft.cost();

    return { nft, cost, owner, user1 };
  }

  it("Should allow minting when user is whitelisted and sends correct ETH", async function () {
    const { nft, cost, user1 } = await deployFixture();

    // Add user1 to whitelist
    await nft.addToWhitelist(user1.address);

    // Mint 1 NFT
    await expect(nft.connect(user1).mint(1, { value: cost }))
      .to.emit(nft, "Minted")
      .withArgs(user1.address, 1);

    // Check token owner
    expect(await nft.ownerOf(1)).to.equal(user1.address);
  });
});
