import "@nomicfoundation/hardhat-chai-matchers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT Contract (Basic Unit Test)", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const name = "MyNFT";
    const symbol = "MNFT";
    const baseURI = "https://example.com/metadata/";

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(name, symbol, baseURI);
    await nft.waitForDeployment();

    return { nft, owner, user1, user2 };
  }

  it("Should deploy with correct name, symbol, and baseURI", async function () {
    const { nft } = await deployFixture();

    expect(await nft.name()).to.equal("MyNFT");
    expect(await nft.symbol()).to.equal("MNFT");
    expect(await nft["owner"]()).to.be.a("string"); // Owner should be set
  });

  it("Should allow only whitelist contract to mint", async function () {
    const { nft, owner, user1 } = await deployFixture();

    // Set whitelistContract to user1
    await nft.connect(owner).setWhitelistContract(user1.address);

    // Mint from user1 (authorized)
    await expect(nft.connect(user1).mint(user1.address, 2))
      .to.emit(nft, "Minted")
      .withArgs(user1.address, 1); // Only checks the first tokenId emitted

    expect(await nft.ownerOf(1)).to.equal(user1.address);
    expect(await nft.totalSupply()).to.equal(2);
    expect(await nft.mintedPerWallet(user1.address)).to.equal(2);
  });

  it("Should revert if unauthorized address tries to mint", async function () {
    const { nft, user2 } = await deployFixture();

    // Not setting any whitelistContract → default = address(0)

    await expect(nft.connect(user2).mint(user2.address, 1)).to.be.revertedWith(
      "Not authorized"
    );
  });

  it("Should allow owner to set baseURI and whitelistContract", async function () {
    const { nft, owner, user1 } = await deployFixture();

    // setBaseURI
    await expect(
      nft.connect(owner).setBaseURI("ipfs://new-uri/")
    ).to.emit(nft, "BaseURIUpdated");

    // setWhitelistContract
    await expect(
      nft.connect(owner).setWhitelistContract(user1.address)
    ).to.emit(nft, "WhitelistContractUpdated")
      .withArgs(user1.address);
  });
});
