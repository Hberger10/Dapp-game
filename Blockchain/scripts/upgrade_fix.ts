import { ethers } from "hardhat";

async function main() {
  // 1. Coloque aqui o endereço do seu Adapter ATUAL (que está no seu Frontend/.env)
  // Se for testnet, pegue o que você já fez deploy.
  // Se for local e você reiniciou o node, terá que fazer o deploy total de novo.
  const ADAPTER_ADDRESS = "0x6d9De96078983CFE8623CEde56325dE0877F5d60"; 

  console.log("Iniciando Upgrade...");

  // 2. Faz o deploy APENAS da nova lógica (o JoKenPo corrigido)
  const JoKenPo = await ethers.getContractFactory("JoKenPo");
  const newLogic = await JoKenPo.deploy();
  await newLogic.waitForDeployment();
  const newLogicAddress = await newLogic.getAddress();

  console.log(`Nova Lógica (V2) deployada em: ${newLogicAddress}`);

  // 3. Conecta no Adapter antigo
  const adapter = await ethers.getContractAt("JKPAdapter", ADAPTER_ADDRESS);

  // 4. Manda o Adapter apontar para a nova lógica
  const tx = await adapter.upgrade(newLogicAddress);
  await tx.wait();

  console.log("Upgrade realizado com Sucesso! 🚀");
  console.log(`O Adapter ${ADAPTER_ADDRESS} agora usa a lógica ${newLogicAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});