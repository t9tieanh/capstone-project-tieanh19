import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("WhitelistSale Contract", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy("MyNFT", "MNFT", "https://example.com/metadata/");
    await nft.waitForDeployment();

    // Deploy MerkleHelper contract
    const MerkleHelper = await ethers.getContractFactory("MerkleHelper");
    const helper = await MerkleHelper.deploy();
    await helper.waitForDeployment();

    // Prepare whitelist (user1 whitelisted)
    const whitelist = [user1.address];
    const leaves = whitelist.map((addr) => keccak256(addr));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();
    const proof = tree.getHexProof(keccak256(user1.address));
    const wrongProof = tree.getHexProof(keccak256(user2.address)); // user2 not in whitelist

    const now = Math.floor(Date.now() / 1000);
    const whitelistEndTime = now + 60 * 60 * 24; // 24h
    const price = ethers.parseEther("0.05");
    const maxSupply = 100;
    const maxPerWallet = 2;

    const WhitelistSale = await ethers.getContractFactory("WhitelistSale");
    const sale = await WhitelistSale.deploy(
      await nft.getAddress(),
      await helper.getAddress(),
      root,
      whitelistEndTime,
      price,
      maxSupply,
      maxPerWallet
    );
    await sale.waitForDeployment();

    // Give WhitelistSale permission to mint NFT
    await nft.setWhitelistContract(await sale.getAddress());

    return {
      nft,
      sale,
      helper,
      owner,
      user1,
      user2,
      proof,
      wrongProof,
      price,
      whitelistEndTime,
    };
  }

  it("Allows whitelisted user to mint for free", async function () {
    const { sale, nft, user1, proof } = await deployFixture();

    await expect(sale.connect(user1).whitelistMint(1, proof))
      .to.emit(sale, "Minted")
      .withArgs(user1.address, 1);

    expect(await nft.ownerOf(1)).to.equal(user1.address);
    expect(await nft.mintedPerWallet(user1.address)).to.equal(1);
  });

  it("Rejects non-whitelisted user with invalid proof", async function () {
    const { sale, user2, wrongProof } = await deployFixture();

    await expect(sale.connect(user2).whitelistMint(1, wrongProof)).to.be.revertedWith(
      "Invalid Merkle Proof"
    );
  });

  it("Rejects minting over maxPerWallet", async function () {
    const { sale, user1, proof } = await deployFixture();

    await sale.connect(user1).whitelistMint(2, proof);

    await expect(sale.connect(user1).whitelistMint(1, proof)).to.be.revertedWith(
      "Max per wallet exceeded"
    );
  });

  it("Rejects minting over maxSupply", async function () {
    const { sale, user1, proof } = await deployFixture();

    // Update maxSupply to 1 (simulate exhaustion)
    await sale.setMaxSupply(1);

    await expect(sale.connect(user1).whitelistMint(2, proof)).to.be.revertedWith(
      "Max supply exceeded"
    );
  });

  it("Allows public mint after whitelist ends", async function () {
    const { sale, user2, price, whitelistEndTime } = await deployFixture();

    // Move time forward
    await ethers.provider.send("evm_setNextBlockTimestamp", [whitelistEndTime + 10]);
    await ethers.provider.send("evm_mine");

    await expect(
      sale.connect(user2).whitelistMint(1, []) // no proof needed
    ).to.be.revertedWith("Insufficient ETH");

    await expect(
      sale.connect(user2).whitelistMint(1, [], { value: price })
    ).to.emit(sale, "Minted");
  });

  it("Allows owner to update configs", async function () {
    const { sale, owner } = await deployFixture();

    await expect(sale.connect(owner).setPrice(ethers.parseEther("0.1"))).to.emit(
      sale,
      "ConfigUpdated"
    );

    await expect(sale.connect(owner).setMaxPerWallet(10)).to.emit(
      sale,
      "ConfigUpdated"
    );

    await expect(sale.connect(owner).setMaxSupply(9999)).to.emit(
      sale,
      "ConfigUpdated"
    );
  });
});
