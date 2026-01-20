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