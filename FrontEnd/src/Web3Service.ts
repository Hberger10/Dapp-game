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
    
    // E aqui também
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
    
    // CORREÇÃO 1: Forçamos dizendo "confia, isso é uma string"
    const address = await contract.methods.getAddress().call() as string;

    if (/^(0x0+)$/.test(address)) {
        // CORREÇÃO 2: Passamos "10" como string (com aspas)
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