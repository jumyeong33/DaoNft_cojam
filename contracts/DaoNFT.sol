// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DaoNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseExtension = ".json";
    bool public paused = false;
    address public mintingContract;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        _preMint(msg.sender, 5);
    }
    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmPfhbDnwDcdw2hC6D1ULQTjRnrJFrCzxq5E79JMMZ9rra/";
    }

    function _preMint(address _to, uint256 _mintAmount) internal onlyOwner {
        uint256 supply = totalSupply();
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    // external
    function safeMint(address _to) external onlyMintingContract {
        uint256 supply = totalSupply();
        require(!paused);

        _safeMint(_to, supply + 1);
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
          ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
          : "";
    }
    //only owner
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setMintingContract(address _mintingContract) external onlyOwner {
        mintingContract = _mintingContract;
    }

    modifier onlyMintingContract() {
        require(mintingContract == msg.sender, "Message sender is not Minting contract");
        _;
    }
}
