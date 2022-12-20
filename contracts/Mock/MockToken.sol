// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MockToken is ERC20 {
  constructor() ERC20('My Token', 'TKN') {
    _mint(msg.sender, 10000 * 10 ** 18);
  }

  function mint(address _to, uint256 _amount) public {
    _mint(_to, _amount);
  }
}