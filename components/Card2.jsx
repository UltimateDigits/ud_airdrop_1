import React, { useState } from "react";
import { Snippet } from "@nextui-org/snippet";
import { useAccount } from "wagmi";

const Card2 = () => {
  const { isConnected, address } = useAccount(); 
  const [showReferralLink, setShowReferralLink] = useState(false);
  const [showConnectWalletMessage, setShowConnectWalletMessage] = useState(false);

  const handleReferClick = () => {
    if (isConnected) {
      setShowReferralLink(true);
    } else {
      setShowConnectWalletMessage(true);
      setTimeout(() => {
        setShowConnectWalletMessage(false);
      }, 5000); // Message disappears after 5 seconds
    }
  };

  return (
    <>
      {showConnectWalletMessage && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-[1050]">
          Connect wallet to start referring.
        </div>
      )}
      <div className="w-[70%] mx-auto bg-gradient-to-l from-[#2070f433] to-[#5e49ba] text-left p-4 rounded-lg shadow sm:p-8 text-white mb-[50px]">
        <h5 className="mb-1 text-[32px] font-Inter text-white">
          Refer and Earn extra Ultimate Points daily
        </h5>
        <p className="mb-5 mt-8 text-[16px] text-white sm:text-lg">
          Could you invite others to join: Both you and the person you refer receive a 20% bonus on daily Ultimate Points earnings for each referral. Additionally, you&apos;ll earn 10% of the points your referred friend accumulates across all seasons.
        </p>
        {showReferralLink && isConnected ? (
          <Snippet variant="solid" color="primary" symbol="">
            {window.location.origin + `/?ref=${address}`}
          </Snippet>
        ) : (
          <button
            onClick={handleReferClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Refer Now
          </button>
        )}
      </div>
    </>
  );
};

export default Card2;
