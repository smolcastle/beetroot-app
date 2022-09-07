const URL = 'https://api.opensea.io/api/v1';

const getAsset = async function getAsset(tokenAddress, tokenId) {
  // fetching only one asset doesn't need opensea api key.
  const options = { method: 'GET' };

  const api_url = `${URL}/asset/${tokenAddress}/${tokenId}/?include_orders=false`;

  const response = fetch(api_url, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));

  return response;
};

const getAssetsInCollection = async function getAssetsInCollection(
  tokenAddress,
  owner
) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': process.env.REACT_APP_OPENSEA_KEY
    }
  };

  const limit = 10; // max assets in the response

  const api_url = `${URL}/assets?owner=${owner}&asset_contract_address=${tokenAddress}&limit=${limit}&include_orders=false`;

  if (tokenAddress !== '') {
    const response = await fetch(api_url, options)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));

    return response;
  }
};

const fetchUserAssets = async function fetchUserAssets(owner) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': process.env.REACT_APP_OPENSEA_KEY
    }
  };

  const limit = 10; // max assets in the response

  const api_url = `${URL}/assets?owner=${owner}&limit=${limit}&include_orders=false`;

  const response = await fetch(api_url, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));

  return response;
};

const fetchUserCollections = async function fetchUserCollections(owner) {
  const options = { method: 'GET', headers: { Accept: 'application/json' } };

  const api_url = `${URL}/collections?asset_owner=${owner}&limit=300`;

  const response = await fetch(api_url, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));

  return response;
};

export {
  getAsset,
  getAssetsInCollection,
  fetchUserAssets,
  fetchUserCollections
};
