import React, { useEffect, useState } from 'react';
import { fetchUserAssets } from '../utils/opensea';

const WalletTab = ({ receiver, truncate }) => {
  const { v4: uuidv4 } = require('uuid'); // to generate unique ids

  const [userAssets, setUserAssets] = useState([]);

  async function getAssets() {
    if (receiver !== '') {
      const getUserAssets = await fetchUserAssets(receiver);
      setUserAssets(getUserAssets.assets);
    }
  }

  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  useEffect(() => {
    getAssets();
  }, [receiver]);

  return (
    <>
      {receiver && (
        <div>
          <div
            className="bg-parsleytint text-parsley py-2 text-[12px] text-center rounded-[4px] w-[40%] mt-4 relative"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
          >
            <p>{truncate(receiver, 14)}</p>
            {hover && (
              <p className="absolute w-full text-[10px] px-2 py-[5px] rounded-[4px] text-white0 bg-gray2">
                {receiver}
              </p>
            )}
          </div>
          <div className=" max-h-[600px] overflow-y-scroll w-[40%] mt-4">
            {userAssets?.map((asset) => {
              return (
                <div
                  key={uuidv4()}
                  className="flex mt-4 justify-between items-center"
                >
                  <div>
                    <h1 className="text-[14px] text-gum">{asset.name}</h1>
                    <p className="text-gray1 text-[14px]">
                      Qty: {asset.last_sale.quantity}
                    </p>
                  </div>
                  <img
                    className="w-[50px] h-[50px] rounded-[4px]"
                    src={asset.image_url}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default WalletTab;
