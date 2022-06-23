import { Seaport } from "@opensea/seaport-js";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const seaport = new Seaport(provider, {
    ascendingAmountFulfillmentBuffer: 300,
    balanceAndApprovalChecksOnOrderCreation: true
});

// const input = {
//     conduitKey: 0,
//     zone: ethers.constants.AddressZero,
//     startTime: Math.floor(Date.now() / 1000).toString(),
//     endTime: this.startTime + 7,
//     offer: '',
//     consideration: '',
//     counter: '',
//     allowPartialFills: false,
//     restrictedByZone: false,
//     fees: 0,
// }

// const newOrder = seaport.createOrder(input, input.conduitKey)

export default seaport
