import axios from "axios";

export async function getCollectionsService() {
    try{
        const response = await axios.get(`https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=0xFFb6D97Bd1E7B7bd08595096d15037401A1f416B`)
        return response.data
    } catch(e){
        console.log('axios error - ', e)
    }
}