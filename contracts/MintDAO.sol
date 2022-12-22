// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DaoNFT.sol";

contract MintDAO is Ownable {

    uint256 public costTier1 = 100 ether;
    uint256 public costTier2 = 200 ether;
    uint256 public costTier3 = 300 ether;

    uint256 public maxSupply = 100;
    uint256 public maxMintAmount = 5;

    DaoNFT public daoNFT;
    IERC20 public cojamToken;

    event Mint(address to, uint256 mintAmount);

    constructor(address _cojamToken, address _daoNFT) {
        cojamToken = IERC20(_cojamToken);
        daoNFT = DaoNFT(_daoNFT);
    }

    function mint(address _to, uint256 _mintAmount) public {
        uint256 supply = daoNFT.totalSupply();

        require(cojamToken.allowance(_to, address(this)) >= costTier1 * _mintAmount, "Not enough allowance to mint, need to approve more token");
        require(_mintAmount > 0, "Cannot mint 0 tokens");
        require(_mintAmount <= maxMintAmount, "Cannot exceed the maximun mint amount");
        require(supply + _mintAmount <= maxSupply, "Cannot exceed the maximum token supply");
        require(daoNFT.balanceOf(_to) + _mintAmount <= maxMintAmount, "Cannot exceed the maximum per-person limit");

        for (uint256 i = 1; i <= _mintAmount; i++) {
            uint256 cost;
            if (supply < 9) {
                cost = costTier1;
            } else if (supply < 14) {
                cost = costTier2;
            } else {
                cost = costTier3;
            }

            cojamToken.transferFrom(_to, address(this), cost);
            daoNFT.safeMint(_to);
            
            emit Mint(_to, _mintAmount);
        }
    }

    function _transferERC20() internal {
        require(cojamToken.transfer(owner(), cojamToken.balanceOf(address(this))));
    }

    function withdraw() public onlyOwner {
        _transferERC20();
    }

}