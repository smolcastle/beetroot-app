const URL = 'https://api.opensea.io/api/v1';

const getAsset = async function getAsset(tokenAddress, tokenId) {
  // fetching only one asset doesn't need opensea api key.
  const options = {method: 'GET'};

  const url_fetch_one_asset = `${URL}/asset/${tokenAddress}/${tokenId}/?include_orders=false`;

  const response = fetch(url_fetch_one_asset, options)
    .then(response => response.json())
    .then(response => response)
    .catch(err => console.error(err));

  return response;
}

export default getAsset;