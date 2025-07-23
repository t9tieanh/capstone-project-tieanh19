import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("NFTMerkleWhitelistV2", function () {
  async function deployFixture() {
    const [owner, user1, user2, user3] = await ethers.getSigners();

    // Setup whitelist
    const whitelistAddresses = [user1.address, user2.address];
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getHexRoot();

    // Deploy MerkleHelper
    const MerkleHelper = await ethers.getContractFactory("MerkleHelper");
    const helper = await MerkleHelper.deploy();
    await helper.waitForDeployment();

    // Deploy MintConfig
    const cost = ethers.parseEther("0.05");
    const maxSupply = 1000;
    const maxPerWallet = 5;
    const whitelistDuration = 3600; // seconds
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const whitelistEndTime = now + whitelistDuration;

    const MintConfig = await ethers.getContractFactory("MintConfig");
    const config = await MintConfig.deploy(
      owner.address,
      cost,
      maxSupply,
      maxPerWallet,
      merkleRoot,
      whitelistEndTime
    );
    await config.waitForDeployment();

    // Deploy NFTMerkleWhitelistV2
    const name = "NFT Game";
    const symbol = "NFTG";
    const baseURI = "https://example.com/metadata/";

    const NFTMerkleWhitelistV2 = await ethers.getContractFactory("NFTMerkleWhitelistV2");
    const nft = await NFTMerkleWhitelistV2.deploy(
      name,
      symbol,
      config.target,
      helper.target,
      baseURI
    );
    await nft.waitForDeployment();

    return { nft, config, helper, merkleTree, cost, user1, user2, user3, owner };
  }

  it("Should mint if user is whitelisted and during whitelist period", async function () {
    const { nft, merkleTree, user1 } = await deployFixture();

    const leaf = keccak256(user1.address);
    const proof = merkleTree.getHexProof(leaf);

    await expect(nft.connect(user1).mint(1, proof))
      .to.emit(nft, "Minted")
      .withArgs(user1.address, 1);

    expect(await nft.ownerOf(1)).to.equal(user1.address);
  });

  it("Should fail if user not in whitelist during whitelist period", async function () {
    const { nft, merkleTree, user3 } = await deployFixture();

    const leaf = keccak256(user3.address);
    const proof = merkleTree.getHexProof(leaf); // Not whitelisted

    await expect(nft.connect(user3).mint(1, proof)).to.be.revertedWith("Invalid Merkle Proof");
  });

  it("Should require ETH payment after whitelist period", async function () {
    const { nft, config, merkleTree, user1, cost } = await deployFixture();

    const leaf = keccak256(user1.address);
    const proof = merkleTree.getHexProof(leaf);

    // Fast forward past whitelist end time
    await ethers.provider.send("evm_increaseTime", [4000]);
    await ethers.provider.send("evm_mine", []);

    await expect(nft.connect(user1).mint(1, proof, { value: cost }))
      .to.emit(nft, "Minted")
      .withArgs(user1.address, 1);
  });

  it("Should revert if minting more than max per wallet", async function () {
    const { nft, merkleTree, user1, config, cost } = await deployFixture();

    const leaf = keccak256(user1.address);
    const proof = merkleTree.getHexProof(leaf);

    const maxPerWallet = await config.maxPerWallet();
    await nft.connect(user1).mint(Number(maxPerWallet), proof);

    await expect(nft.connect(user1).mint(1, proof)).to.be.revertedWith("Exceeds max per wallet");
  });

  it("Should allow minting after extending whitelistEndTime", async function () {
    const { nft, config, merkleTree, user1, cost, owner } = await deployFixture();

    const leaf = keccak256(user1.address);
    const proof = merkleTree.getHexProof(leaf);

    // Tua nhanh vượt qua whitelist ban đầu
    await ethers.provider.send("evm_increaseTime", [4000]);
    await ethers.provider.send("evm_mine", []);

    // Cập nhật lại whitelistEndTime bằng quyền owner
    const newEndTime = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    await config.connect(owner).setWhitelistEndTime(newEndTime);

    // Mint miễn phí trở lại
    await expect(nft.connect(user1).mint(1, proof))
        .to.emit(nft, "Minted")
        .withArgs(user1.address, 1);
  });

  it("Should allow minting with new Merkle root after updating whitelist", async function () {
    const { nft, config, helper, user3, owner } = await deployFixture();

    // Tạo Merkle Tree mới có user3
    const newWhitelist = [user3.address];
    const newLeaves = newWhitelist.map(addr => keccak256(addr));
    const newMerkleTree = new MerkleTree(newLeaves, keccak256, { sortPairs: true });
    const newRoot = newMerkleTree.getHexRoot();

    // Cập nhật lại Merkle Root trong MintConfig
    await config.connect(owner).setMerkleRoot(newRoot);

    // user3 thử mint
    const newProof = newMerkleTree.getHexProof(keccak256(user3.address));

    await expect(nft.connect(user3).mint(1, newProof))
        .to.emit(nft, "Minted")
        .withArgs(user3.address, 1);
    });

    it("Should fail if insufficient ETH sent after whitelist period", async function () {
    const { nft, merkleTree, user1, cost } = await deployFixture();

    const leaf = keccak256(user1.address);
    const proof = merkleTree.getHexProof(leaf);

    await ethers.provider.send("evm_increaseTime", [4000]);
    await ethers.provider.send("evm_mine", []);

    await expect(nft.connect(user1).mint(1, proof, { value: cost / 2n }))
        .to.be.revertedWith("Insufficient ETH for public sale");
    });
});
