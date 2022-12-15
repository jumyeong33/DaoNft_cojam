// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Helloworld {
    string public message;
    address owner;

    constructor(string memory _message) {
        message = _message;
        owner = msg.sender;
    }

    function hello() public view returns (string memory) {
        return message;
    }
}