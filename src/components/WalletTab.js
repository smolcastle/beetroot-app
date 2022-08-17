import React from 'react';
import { useBalance } from 'wagmi';

const WalletTab = ({ receiver, truncate }) => {
  const balance = useBalance({
    addressOrName: receiver
  });

  return (
    <div>
      <div className="bg-parsleytint text-parsley p-2 text-[12px] rounded-[4px] w-[40%]">
        {truncate(receiver, 14)}
      </div>
    </div>
  );
};

export default WalletTab;
