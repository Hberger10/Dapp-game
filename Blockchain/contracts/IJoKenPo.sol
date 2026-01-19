// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IJoKenPo {
    
    
    function getBid() external view returns (uint256);
    
    function setBid(uint256 newBid) external;
    
    function getcomission() external view returns (uint8);
    
    function setcomission(uint8 newComissionPercent) external;
    
    function getStatus() external view returns (string memory);
    
    function getBalance() external view returns (uint);

    function play1(string memory Choice_string) external payable;
    
    function play2(string memory Choice_string2) external payable;
    
    function win() external returns (string memory);
}