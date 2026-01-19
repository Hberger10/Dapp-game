import { ethers } from "hardhat";

async function main() {
  const JoKenPoimplementation = await ethers.deployContract("JoKenPo");
  await JoKenPoimplementation.waitForDeployment();
  const address = await JoKenPoimplementation.getAddress();
  console.log(`Contract deployed at ${address}`);

  const JoKenPoAdapterimplementation = await ethers.deployContract("JKPAdapter");
  await JoKenPoAdapterimplementation.waitForDeployment();
  const address2 = await JoKenPoAdapterimplementation.getAddress();
  console.log(`Contract deployed at ${address2}`);

  await JoKenPoAdapterimplementation.upgrade(address);
  console.log(`Contract upgraded`);

  console.log("\nCOPIE ESTE ADAPTER PARA O REACT:", address2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});