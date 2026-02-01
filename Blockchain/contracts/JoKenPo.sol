// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./IJoKenPo.sol";

contract JoKenPo is IJoKenPo { 
    enum Choice { NONE, Rock, Paper, Scissors } 

    address public player1;
    address public player2;
    Choice private choosePlayer1 = Choice.NONE;
    string private status = "";
    Choice private choosePlayer2 = Choice.NONE;
    uint256 private bid = 0.01 ether;
    uint8 private comissionPercent = 10;

    address payable private immutable owner;

    
    
    
    mapping(address => uint) public winCount;

    constructor() {
        owner = payable(msg.sender);
    }
    function getBid() external view returns (uint256) {
        return bid;
    }
    function setBid(uint256 newBid) external {
        require(tx.origin == owner, "Only the owner can set the bid");
        require(player1 == address(0), "Cannot change bid during an active game");
        bid = newBid;   
    }
    function getcomission() external view returns (uint8) {
        return comissionPercent;
    }
    function setcomission(uint8 newComissionPercent) external {
        require(tx.origin == owner, "Only the owner can set the comission");
        require(player1 == address(0), "Cannot change comission during an active game");
        comissionPercent = newComissionPercent;   
    }
    function getStatus() external view returns (string memory) {
        return status;
    }

    




    
    function compare(string memory str1, string memory str2)
        private
        pure
        returns (bool)
    {
        bytes memory arrA = bytes(str1);
        bytes memory arrB = bytes(str2);
        return keccak256(arrA) == keccak256(arrB);
    }

   
    function finishGame(address winner) private {
        
        winCount[winner]++;

        choosePlayer1 = Choice.NONE;
        choosePlayer2 = Choice.NONE;
        player1 = address(0);
        player2 = address(0);

        status = "";

        
        uint totalBalance = address(this).balance;  
        uint ownerFee = (totalBalance * comissionPercent) / 100; 
        uint winnerPrize = totalBalance - ownerFee;

        
        (bool successWinner, ) = payable(winner).call{value: winnerPrize}("");
        require(successWinner, "Payement to winner is failed");

        
        (bool successOwner, ) = owner.call{value: ownerFee}("");
        require(successOwner, "Pagamento da taxa falhou");

        
        
    }

    function getBalance() external view returns (uint) {
        require(msg.sender == owner || tx.origin == owner, "Restricted");
        return address(this).balance;
    }

    
    function play1(string memory Choice_string) external payable returns (string memory) {
        if (player1 == address(0)) {
            player1 = tx.origin;
        }
        require(tx.origin == player1, "You are not Player 1");
        require(choosePlayer1 == Choice.NONE, "Player 1 has already played in this round."); 

        require(
            compare(Choice_string, "Rock") ||
                compare(Choice_string, "Paper") ||
                compare(Choice_string, "Scissors"),
            "Invalid choice"
        );
        require(msg.value >= bid, "You need to pay the bid amount");

        if (compare(Choice_string, "Rock")) {
            choosePlayer1 = Choice.Rock;
        }
        if (compare(Choice_string, "Paper")) {
            choosePlayer1 = Choice.Paper;
        }
        if (compare(Choice_string, "Scissors")) {
            choosePlayer1 = Choice.Scissors;
        }
        return status = "Player 1 has already chosen";
    }

    function play2(string memory Choice_string2) external payable returns (string memory) {
        if (player2 == address(0)) {
            player2 = tx.origin;
        }
        require(tx.origin == player2, "You are not Player 2");
        require(tx.origin != player1, "Player 1 cannot play again");
        require(choosePlayer1 != Choice.NONE, "Player 1 has not played yet");
        require(choosePlayer2 == Choice.NONE, "Player 2 has already played this round");

        require(
            compare(Choice_string2, "Rock") ||
                compare(Choice_string2, "Paper") ||
                compare(Choice_string2, "Scissors"),
            "Invalid choice"
        );
        require(msg.value >= bid, "You need to pay the bid amount");

        if (compare(Choice_string2, "Rock")) {
            choosePlayer2 = Choice.Rock;
        }
        if (compare(Choice_string2, "Paper")) {
            choosePlayer2 = Choice.Paper;
        }
        if (compare(Choice_string2, "Scissors")) {
            choosePlayer2 = Choice.Scissors;
        }

        return status = "Both players have played!";
    }

    
    function win() public returns (string memory) {
        require(
            choosePlayer1 != Choice.NONE && choosePlayer2 != Choice.NONE,
            "Both players have not played"
        );

        

        
        if (choosePlayer1 == choosePlayer2) {
            status = "Tie! Prize rolls over. Play again!";
            choosePlayer1 = Choice.NONE;
            choosePlayer2 = Choice.NONE;
            return "Tie";
        }

       
        address winner;
        if (
            (choosePlayer1 == Choice.Rock && choosePlayer2 == Choice.Scissors) ||
            (choosePlayer1 == Choice.Paper && choosePlayer2 == Choice.Rock) ||
            (choosePlayer1 == Choice.Scissors && choosePlayer2 == Choice.Paper)
        ) {
            winner = player1;
            status = "Player 1 wins!";
        } else {
            winner = player2;
            status = "Player 2 wins!";
        }
        
        finishGame(winner);
        return status;
    }
}