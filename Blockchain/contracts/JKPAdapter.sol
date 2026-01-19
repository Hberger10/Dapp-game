// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IJoKenPo.sol";

contract JKPAdapter {
    
    
    IJoKenPo private joKenPo;
    
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function getAddress() external view returns (address) {
        return address(joKenPo);
    }

    
    modifier upgraded() {
        require(address(joKenPo) != address(0), "Contract not initialized");
        _;
    }

    
    function upgrade(address newImplementation) external {
        require(msg.sender == owner, "You do not have permission");
        require(newImplementation != address(0), "Empty address is not permitted");
        
        joKenPo = IJoKenPo(newImplementation);
    }

    
    function getBid() external view upgraded returns (uint256) {
        return joKenPo.getBid();
    }

    function getcomission() external view upgraded returns (uint8) {
        return joKenPo.getcomission();
    }

    function getStatus() external view upgraded returns (string memory) {
        return joKenPo.getStatus();
    }

    function getBalance() external view upgraded returns (uint) {
        return joKenPo.getBalance();
    }

    
    function setBid(uint256 newBid) external restricted upgraded {
        joKenPo.setBid(newBid);
    }

    function setcomission(uint8 newComissionPercent) external restricted upgraded {
        joKenPo.setcomission(newComissionPercent);
    }

    modifier restricted() {
        require(msg.sender == owner, "You do not have permission");
        _;
    }

   
    
    function play1(string memory Choice_string) external payable upgraded {
        joKenPo.play1{value: msg.value}(Choice_string);
    }

    function play2(string memory Choice_string2) external payable upgraded {
        joKenPo.play2{value: msg.value}(Choice_string2);
    }

    function win() external upgraded returns (string memory) {
        return joKenPo.win();
    }
}