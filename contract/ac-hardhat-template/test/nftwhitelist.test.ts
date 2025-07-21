import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Basic NFT Mint Test", function () {
  async function deployFixture() {
    const [owner, user1] = await ethers.getSigners();

    // Constructor arguments
    const name = "NFT Game";
    const symbol = "NFTG";
    const cost = ethers.parseEther("0.05"); // 0.05 ETH per NFT
    const maxSupply = 1000;
    const maxPerWallet = 5;
    const baseURI = "https://687144367ca4d06b34b9e592.mockapi.io/metadata/";

    const NFTWhitelist = await ethers.getContractFactory("NFTWhitelist");
    const nft = await NFTWhitelist.deploy(
      name,
      symbol,
      cost,
      maxSupply,
      maxPerWallet,
      baseURI
    );
    await nft.waitForDeployment();

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

    // Verify ownership of the token (ID = 0)
    expect(await nft.ownerOf(0)).to.equal(user1.address);
  });
});
