// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    address public whitelistContract;
    uint256 public totalSupply;
    string public baseTokenURI;
    mapping(address => uint256) public mintedPerWallet;

    event Minted(address indexed to, uint256 tokenId);
    event BaseURIUpdated(string newBaseURI);
    event WhitelistContractUpdated(address newContract);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory _initialBaseURI
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        baseTokenURI = _initialBaseURI;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == whitelistContract, "Not authorized");
        require(amount > 0, "Invalid amount");

        for (uint256 i = 0; i < amount; i++) {
            totalSupply++;
            _safeMint(to, totalSupply);
            emit Minted(to, totalSupply);
        }

        mintedPerWallet[to] += amount;
    }

    // ----------------------
    // ADMIN FUNCTIONS
    // ----------------------

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function setWhitelistContract(address _contract) external onlyOwner {
        whitelistContract = _contract;
        emit WhitelistContractUpdated(_contract);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}
