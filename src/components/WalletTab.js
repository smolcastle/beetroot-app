import React, { useEffect, useState } from 'react';
import { fetchUserCollections } from '../utils/opensea';

const WalletTab = ({ receiver, truncate }) => {
  const { v4: uuidv4 } = require('uuid'); // to generate unique ids

  const [userCollections, setUserCollections] = useState([]);

  async function getCollections() {
    if (receiver !== '') {
      const getUserCollections = await fetchUserCollections(receiver);
      setUserCollections(getUserCollections);
    }
  }

  useEffect(() => {
    getCollections();
  }, [receiver]);

  return (
    <>
      {receiver && (
        <div>
          <div className=" max-h-[600px] overflow-y-scroll w-[40%] mt-4">
            {userCollections?.map((collection) => {
              return (
                <div
                  key={uuidv4()}
                  className="flex mt-4 justify-between items-center"
                >
                  <div>
                    <h1 className="text-[14px] text-gum">{collection.name}</h1>
                    <p className="text-gray1 text-[14px]">
                      Qty: {collection.owned_asset_count}
                    </p>
                  </div>
                </div>
              );
            })}
            {userCollections.length === 0 && (
              <p className="text-gray1 text-[12px]">No NFTs Found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WalletTab;
