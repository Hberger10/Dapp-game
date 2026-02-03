import Web3 from "web3";
import ABI from "./abi.json";





type LoginResult = {
    account: string;
    isAdmin: boolean;
}
const ADAPTER_ADDRESS= import.meta.env.VITE_ADAPTER_ADDRESS;

function getWeb3(): Web3 {
    if (!window.ethereum) throw new Error(`No MetaMask found.`);
    return new Web3(window.ethereum);
    }

function getContract(web3?: Web3) {
    if (!web3) web3 = getWeb3();
    return new web3.eth.Contract(ABI, ADAPTER_ADDRESS);
}


export async function doLogin(): Promise<LoginResult> {
    
    const web3 = getWeb3();
    const accounts = await web3.eth.requestAccounts();

    if (!accounts || !accounts.length) {
        throw new Error(`Wallet not found/allowed.`);
    }

    const contract = getContract(web3);
    const ownerAddress: string = await contract.methods.owner().call();


    const isAdmin = accounts[0].toLowerCase() === ownerAddress.toLowerCase();

    localStorage.setItem("account", accounts[0]);
    localStorage.setItem("isAdmin", `${isAdmin}`);

    return {
        account: accounts[0],
        isAdmin: isAdmin 
    } as LoginResult;
}

export function doLogout(){
    localStorage.removeItem("account");
    localStorage.removeItem("isAdmin");
}
export type Dashboard={
    bid?: string;
    commission?: string;
    address?: string;
}
export async function upgrade(newContract: string): Promise<string> {
    const contract = getContract();
    
    
    const web3 = getWeb3();
    const accounts = await web3.eth.requestAccounts();

    const tx = await contract.methods.upgrade(newContract).send({ from: accounts[0] });
    return tx.transactionHash;
}
export async function setCommission(newCommission: number): Promise<string> {
    const contract = getContract();
    
    
    const web3 = getWeb3();
    const accounts = await web3.eth.requestAccounts();

    
    const tx = await contract.methods.setcomission(newCommission).send({ from: accounts[0] });
    
    return tx.transactionHash;
}
export async function setBid(newBid: string): Promise<string> {
    const contract = getContract();
    
    // Mesma correção aqui
    const web3 = getWeb3();
    const accounts = await web3.eth.requestAccounts();

    const tx = await contract.methods.setBid(newBid).send({ from: accounts[0] });
    return tx.transactionHash;
}
export async function getDashboard(): Promise<Dashboard> {
    const contract = getContract();
    
    
    const address = await contract.methods.getAddress().call() as string;

    if (/^(0x0+)$/.test(address)) {
        
        return { 
            bid: Web3.utils.toWei("0.01", "ether"), 
            commission: "10", 
            address 
        } as Dashboard;
    }

    const bid = await contract.methods.getBid().call() as string;
    const commission = await contract.methods.getcomission().call() as string;

    return { bid, commission, address } as Dashboard;
}

export type LeaderBoard = {
    
    result?: string;
};

export enum Choice {
    NONE,
    ROCK,
    PAPER,
    SCISSORS
};

export async function play(option: Choice): Promise<string> {
    const web3 = getWeb3();
    const contract = getContract(web3);
    const accounts = await web3.eth.requestAccounts();

    // 1. Pegamos o valor da aposta
    const bidResponse = await contract.methods.getBid().call();
    const bid = String(bidResponse);

    // 2. Traduzimos a escolha
    let choiceString = "";
    switch(option) {
        case Choice.ROCK: choiceString = "Rock"; break;
        case Choice.PAPER: choiceString = "Paper"; break;
        case Choice.SCISSORS: choiceString = "Scissors"; break;
        default: throw new Error("Invalid choice selected");
    }

    // 3. Verificação via STATUS (Pois o Adapter não expõe player1)
    let isPlayer1Empty = true; 

    try {
        // O Adapter tem a função getStatus
        const status = await contract.methods.getStatus().call();
        const statusStr = String(status);
        
        console.log("Status vindo do Adapter:", statusStr);

        // Se o status diz que P1 já jogou ou está esperando, então NÃO sou o P1
        if (statusStr.includes("Player 1") || statusStr.includes("Waiting")) {
            isPlayer1Empty = false;
        }

    } catch (err) {
        console.warn("Erro ao ler status. Assumindo Player 1.", err);
        isPlayer1Empty = true;
    }

    console.log(`Vou jogar como: ${isPlayer1Empty ? "Player 1" : "Player 2"}`);

    let tx: any;

    if (isPlayer1Empty) {
        tx = await contract.methods.play1(choiceString).send({ 
            from: accounts[0], 
            value: bid 
        });
    } else {
        tx = await contract.methods.play2(choiceString).send({ 
            from: accounts[0], 
            value: bid 
        });
    }

    return tx.transactionHash;
}

export async function getResult() : Promise<string> {
    const contract = getContract();
    return contract.methods.getStatus().call();
    
}

export async function getLeaderBoard() : Promise<LeaderBoard> {
    const contract = getContract();
    const result = await contract.methods.getStatus().call();
    return { result } as LeaderBoard;
   
}

export type player={
    address:string;
    wins:number;

}

export async function finishGame(): Promise<string> {
    const web3 = getWeb3();
    const contract = getContract(web3);
    const accounts = await web3.eth.requestAccounts();

    
    const tx = await contract.methods.win().send({ from: accounts[0] });
    
    return tx.transactionHash;
}

// Web3Service.ts

// Web3Service.ts

export async function doListen(onEvent: () => void) {
    // 1. Instancia a conexão WebSocket (igual ao seu código original para garantir conexão)
    const web3 = new Web3(import.meta.env.VITE_WEBSOCKET_SERVER);
    // @ts-ignore (Caso o TS reclame do ABI, pode ignorar ou usar aspas)
    const contract = new web3.eth.Contract(ABI, import.meta.env.VITE_ADAPTER_ADDRESS);

    console.log("📡 Iniciando monitoramento WebSocket...");

    // 2. CRUCIAL: Sem passar { filter: ... } nem { fromBlock: ... }
    // Isso garante que ouvimos "fofocas" de QUALQUER jogador
    const subscription = contract.events.Played(); 

    // 3. Configura o Listener com logs de debug
    subscription.on("data", (event: any) => {
        console.log("🔥 Evento recebido da Blockchain!");
        
        // Esses logs vão te provar se o Owner ou o Player 2 disparou o evento
        if (event.returnValues) {
            console.log(" > Jogador:", event.returnValues.player);
            console.log(" > Status:", event.returnValues.status);
        }

        // Avisa o React para atualizar a tela
        onEvent(); 
    });

    subscription.on("error", (error: any) => {
        console.warn("⚠️ Aviso WebSocket:", error.message || error);
    });

    return subscription;
}