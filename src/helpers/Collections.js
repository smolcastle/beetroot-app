import { COLLECTIONS } from "../utils/constants";

export function getCollectionsList(data, label_id) {
  const collections = {};
  data?.forEach((trade) => {
    const {
      address,
      token_standard,
      to_address,
      from_address,
      token_symbol,
      tx_id,
    } = trade;
    if (COLLECTIONS[address]) {
      if (!collections[address]) {
        collections[address] = {
          address,
          name: COLLECTIONS[address] ? COLLECTIONS[address].name : null,
          image_url:
            "https://lh3.googleusercontent.com/Y8yUsNKfprQ-n0gJ9hnoU0wrApIu06BNoiyY6F89uabke3LpBYY0QzJMJp11-C_dT6SjmeapQkkZF-9xhvo7eKOxMJUjrUyenvVZXw=s300",
        };
        collections[address].items = {};
        collections[address].trade = [];
      }
      collections[address].trade.push(trade);
      if (token_standard === "ERC721" || token_standard === "ERC1155") {
        if (to_address === label_id) {
          collections[address].items[token_symbol] = trade;
        }
        if (from_address === label_id) {
          delete collections[address].items[token_symbol];
        }
      }
    }
  });
  return Object.values(collections).filter(
    (collection) => Object.values(collection.items).length > 0
  );
}

export function isFunction(functionToCheck) {
  var getType = {};
  return (
    functionToCheck &&
    getType.toString.call(functionToCheck) === "[object Function]"
  );
}

export function truncate(fullStr, strLen, separator) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 3);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}
