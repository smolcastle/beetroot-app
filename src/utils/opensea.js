import { OpenSeaSDK, Network } from 'opensea-js';
import { publicProvider } from 'wagmi/providers/public';
require('dotenv').config();

const provider = publicProvider();

const openseaSDK = new OpenSeaSDK(provider, {
  networkName: Network.Main,
  apiKey: OPENSEA_KEY
})

const assets = async function getAsset(tokenAddress, tokenId) {
    const asset = await openseaSDK.api.getAsset({
        tokenAddress, tokenId
    });
    return asset;
}

export default assets;