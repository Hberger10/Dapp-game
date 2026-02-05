// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Porrinha {
    address public player1;
    address public player2;
    uint256 private bid = 0.01 ether;
    

    address payable private immutable owner;

    mapping(address => uint) public winCount;

    constructor() {
        owner = payable (msg.sender);
    }


    }