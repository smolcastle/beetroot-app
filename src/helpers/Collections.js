import { COLLECTIONS } from "../utils/constants";

export function getCollectionsList(data) {
  const collections = {};
  data.forEach((trade) => {
    const { address, token_standard, to_address, from_address, token_symbol } =
      trade;
    if (
      COLLECTIONS[address] &&
      (token_standard === "ERC721" || token_standard === "ERC1155")
    ) {
      if (!collections[address]) {
        collections[address] = {
          address,
          name: COLLECTIONS[address] ? COLLECTIONS[address].name : null,
          image_url:
            "https://lh3.googleusercontent.com/Y8yUsNKfprQ-n0gJ9hnoU0wrApIu06BNoiyY6F89uabke3LpBYY0QzJMJp11-C_dT6SjmeapQkkZF-9xhvo7eKOxMJUjrUyenvVZXw=s300",
        };
        collections[address].items = {};
      }
      if (to_address === "70222") {
        collections[address].items = {
          [token_symbol]: trade,
        };
      }
      if (from_address === "70222") {
        delete collections[address].items[token_symbol];
      }
    }
  });
  return Object.values(collections).filter(
    (collection) => Object.values(collection.items).length > 0
  );
}
