// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DaoNFT.sol";

contract MintDAO is Ownable {

    uint256 public cost = 100 ether;
    uint256 public costNext = 200 ether;
    uint256 public maxSupply = 100;
    uint256 public maxMintAmount = 5;

    DaoNFT public daoNFT;
    IERC20 public cojamToken;

    constructor(address _cojamToken, address _daoNFT) {
        cojamToken = IERC20(_cojamToken);
        daoNFT = DaoNFT(_daoNFT);
    }

    function mint(address _to, uint256 _mintAmount) public {
        uint256 supply = daoNFT.totalSupply();
        require(cojamToken.allowance(msg.sender, address(this)) > cost + costNext, "NOT ENOUGH ALLOWANCE TO MINT, NEED TO APPROVE MORE TOKEN");
        require(_mintAmount > 0, "HAVE TO MINT MORE THAN 0");
        require(_mintAmount <= maxMintAmount, "OVER AVAILABLE MINT AMOUNT");
        require(supply + _mintAmount <= maxSupply, "OVER MAX SUPPLY");

        for (uint256 i = 1; i <= _mintAmount; i++) {
            if(supply > 500) {
                cojamToken.transferFrom(msg.sender, address(this), costNext);
            } else {
                cojamToken.transferFrom(msg.sender, address(this), cost);
            }
            daoNFT.safeMint(_to);
        }
    }
    function withdraw() public onlyOwner {
        require(cojamToken.approve(address(this), cojamToken.balanceOf(address(this))));
        require(cojamToken.transferFrom(address(this), msg.sender, cojamToken.balanceOf(address(this))));
    }
}