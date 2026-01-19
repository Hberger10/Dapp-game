import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("JoKenPo Tests", function () {


  async function deployFixture() {
    const [owner, player1, player2] = await ethers.getSigners();

    const JoKenPo = await ethers.getContractFactory("JoKenPo");
    const joKenPo = await JoKenPo.deploy();

    return { joKenPo, owner, player1, player2 };
  }

  it("Should set bid", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

    const newBid = ethers.parseEther("0.02");

    await joKenPo.setBid(newBid);

    const updatedBid = await joKenPo.getBid();

    expect(updatedBid).to.equal(newBid);
  });
  it("Should NOT set bid", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = joKenPo.connect(player1);
    const newBid = ethers.parseEther("0.03");

    await joKenPo.setBid(newBid);
    await expect(player1Instance.setBid(ethers.parseEther("0.03"))).to.be.revertedWith("Only the owner can set the bid");
  });


  it("Should setcomission", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);

    const newComission = 15;

    await joKenPo.setcomission(newComission);

    const updatedComission = await joKenPo.getcomission();

    expect(updatedComission).to.equal(newComission);
  });


  it("Should play", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);
    const newBid = ethers.parseEther("0.02");

    const player1Instance = joKenPo.connect(player1);
    await player1Instance.play1("Rock", { value: newBid });

    const player2Instance = joKenPo.connect(player2);
    await player2Instance.play2("Scissors", { value: newBid });
    
    const wins = await joKenPo.win();
    const status = await joKenPo.getStatus();

    expect(status).to.equal("Player 1 wins!");
  }); 

  it("Should fail if Player 1 tries to play twice", async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture);
    const bid = ethers.parseEther("0.01");

    
    await joKenPo.connect(player1).play1("Rock", { value: bid });

    
    await expect(
        joKenPo.connect(player1).play1("Paper", { value: bid })
    ).to.be.revertedWith("Player 1 has already played in this round.");
  });


  it("Should balance owner", async function () {
    const { joKenPo, owner, player1, player2 } = await loadFixture(deployFixture);
    
    const newBid = ethers.parseEther("0.02");
    await joKenPo.setBid(newBid);

    const balanceBefore = await ethers.provider.getBalance(owner.address);

    const player1Instance = joKenPo.connect(player1);
    await player1Instance.play1("Rock", { value: newBid });

    const player2Instance = joKenPo.connect(player2);
    await player2Instance.play2("Scissors", { value: newBid });
    
    await player1Instance.win();

    const balanceAfter = await ethers.provider.getBalance(owner.address);
    const expectedFee = ethers.parseEther("0.004");
  

    expect(balanceAfter).to.equal(balanceBefore + expectedFee);
  });

  it("Should fail if player sends less ETH than bid", async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture);
    
    await expect(
        joKenPo.connect(player1).play1("Rock", { value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("You need to pay the bid amount"); 
    
  });

  it("Should NOT play (wrong option)", async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture);
    
    await expect(
        joKenPo.connect(player1).play1("NONE", { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Invalid choice"); 
    
  });



  

});