import React, { useState } from "react";
import Modal from "react-modal";
import udABI from "../abi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { getAccount } from "@wagmi/core";
import {
  useAccount,
  useWriteContract,
  useWatchPendingTransactions,
} from "wagmi";
import { writeContract } from "@wagmi/core";
import { http, createConfig } from "wagmi";
import { baseSepolia, base } from "viem/chains";
Modal.setAppElement("#__next");

const MintModal = ({ setStatus, closeModal }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [mintingStatus, setMintingStatus] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };

  const config = createConfig({
    chains: [baseSepolia, base],
    transports: {
      [baseSepolia.id]: http(
        "https://base-sepolia.g.alchemy.com/v2/CIE4zKPNF0FgcNapbXsMjxZiwfodi04_"
      ),
      [base.id]: http(
        " https://base-mainnet.g.alchemy.com/v2/1lpy8WVnMciIEdxmUycg9j8gjs4j76tF"
      ),
    },
  });

  const { isConnected, error, isError } = useAccount();
  const account = useAccount();
  // const { data: hash, writeContract } = useWriteContract();
  const mintNFT = async () => {
    console.log("isConected:", isConnected);
    if (!isConnected) {
      setMintingStatus("Please connect your wallet to mint the NFT.");
      return;
    }

    try {
      setMintingStatus("Minting NFT...");
      console.log("address:", account.address);
      console.log("account-config:", config);
      const mintTx = await writeContract(config, {
        abi: udABI,
        address: process.env.UD_CONTRACT_ADDRESS,
        function: "mintNFT",
        args: [],
      });
      console.log("isConnected:", account.isConnected);
      console.log("connectedAddress:", account.address);
      console.log("mintTx:", mintTx);
      console.log("txHash:", hash);
      setTransactionDetails(mintTx);
      console.log("error:", error);
      console.log("isError:", isError);
      if (mintTx) {
        setMintingStatus("NFT minted successfully!");
      }

      // Update the status in the parent component
      // updateStatusAfterMint();
    } catch (error) {
      setMintingStatus("Error minting NFT. Please try again.");
      console.error("Error minting NFT:", error);
    }
  };

  const updateStatusAfterMint = () => {
    setStatus((oldVal) => ({ ...oldVal, 3: "Points Claimed" }));
    closeModal();
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      contentLabel="Mint NFT Modal"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-xl mx-auto transition-all duration-500 transform scale-100">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-4">
            Mint Ultimate Points Genesis NFT
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="mb-6">
          This is a special NFT that grants you access to exclusive features and
          rewards in our platform.
        </p>
        {mintingStatus && <p className="text-blue-500 mb-4">{mintingStatus}</p>}
        {transactionDetails && (
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h3 className="text-lg font-bold mb-2">Transaction Details</h3>
            <p>TokenId: {transactionDetails.tokenId}</p>
            <p>Chain: {transactionDetails.chain}</p>
            <p>Minted to: {transactionDetails.mintedToAddress}</p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 transition-colors duration-300 mr-2"
            onClick={mintNFT}
          >
            Mint NFT
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-400 transition-colors duration-300"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MintModal;
