import Web3 from "web3";
import ABI from "./abi.json";

type LoginResult = {
    account: string;
    isAdmin: boolean;
}

export async function doLogin(): Promise<LoginResult> {
    
    if (!window.ethereum) throw new Error(`No MetaMask found.`);
    
    const web3 = new Web3(window.ethereum);
 
    const accounts = await web3.eth.requestAccounts();

    if (!accounts || !accounts.length) {
        throw new Error(`Wallet not found/allowed.`);
    }

    
    const contract = new web3.eth.Contract(ABI, import.meta.env.VITE_ADAPTER_ADDRESS, { from: accounts[0] });

    
    const ownerAddress: string = await contract.methods.owner().call();

    
    localStorage.setItem("account", accounts[0]);
    
    localStorage.setItem("isAdmin", `${accounts[0] === ownerAddress}`);

    
    return {
        account: accounts[0],
        isAdmin: accounts[0] === ownerAddress
    } as LoginResult;
}