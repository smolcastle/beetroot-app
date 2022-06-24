import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";

function sp(){
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const seaport = new Seaport(provider);
        return seaport
    }
    else{
        const provider = ethers.getDefaultProvider();
        const seaport = new Seaport(provider);
        return seaport
    }
}

let seaport = sp()

export default seaport
