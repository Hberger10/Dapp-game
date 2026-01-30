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
    
    
    const web3 = getWeb3();
    const accounts = await web3.eth.requestAccounts();

    const tx = await contract.methods.setBid(newBid).send({ from: accounts[0] });
    return tx.transactionHash;
}
export async function getDashboard(): Promise<Dashboard> {
    const contract = getContract();
    
    
    const address = await contract.methods.getAddress().call() as string;

    if (/^(0x0+)$/.test(address)) {
        1
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

    
    const bidResponse = await contract.methods.getBid().call();
    const bid = String(bidResponse);

    
    let choiceString = "";
    switch(option) {
        case Choice.ROCK: choiceString = "Rock"; break;
        case Choice.PAPER: choiceString = "Paper"; break;
        case Choice.SCISSORS: choiceString = "Scissors"; break;
        default: throw new Error("Invalid choice selected");
    }

    
    let isPlayer1Empty = false;

    try {
        
        const player1Address = await contract.methods.player1().call() as string;
        isPlayer1Empty = /^0x0+$/.test(player1Address);
        console.log("Player 1 Address:", player1Address);
    } catch (err) {
        
        console.warn("Erro ao ler player1. Tentando pelo Status...");
        try {
            const status = await contract.methods.getStatus().call() as string; // <--- AQUI O ERRO QUE VOCÊ VIU
            
            if (!status || status === "") {
                isPlayer1Empty = true;
            } else if (status.includes("Player 1")) {
                
                isPlayer1Empty = false;
            }
        } catch (e) {
            
            isPlayer1Empty = true; 
        }
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
export function listentoEvent(callback: (event: any) => void) {
  const provider = new Web3.providers.WebsocketProvider(
    `${import.meta.env.VITE_WEBSOCKET_SERVER}`
  );
  const web3 = new Web3(provider);

  const contract = new web3.eth.Contract(ABI, ADAPTER_ADDRESS);

  const subscription = contract.events.Played({
    fromBlock: 'latest'
  });

  subscription
  .on('data', (event: any) => {
    callback(event);
  })
  .on('error', (error: Error) => {
    console.error('Error listening to events:', error);
  });

  return () => {
    subscription.unsubscribe();
  };
}