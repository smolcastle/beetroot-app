import { Seaport } from "@opensea/seaport-js";
import { ethers, Signer } from "ethers";

function sp(){
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const seaport = new Seaport(provider);
        return { seaport : seaport, signer: provider.getSigner() }
    }
    else{
        const provider = ethers.getDefaultProvider();
        const seaport = new Seaport(provider);
        return { seaport: seaport, signer: provider.getSigner() }
    }
}

let seaport = sp()

export default seaport
