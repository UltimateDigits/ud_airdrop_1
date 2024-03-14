import React from "react";
import "../styles/Home.module.css";
const Card1 = () => {
  return (
    <div className="w-[70%]  bg-gradient-to-r from-[#2070f42b] to-[#c6dbff30] text-left p-4 rounded-lg shadow sm:p-8 mb-[30px]">
      <h5 className="mb-2 text-[30px] font-bold text-white">
        Frens of Ultimate Digits will be <br /> airdropped 12% of $ULT&apos;s
        circulating <br />
        supply on launch based on <br />
        accumulated Ultimate Points.
      </h5>
      <p className="mb-2 mt-8 text-[20px] text-white sm:text-lg">
        Ultimate Points&apos; balances will be refreshed every 24 hours
      </p>
    </div>
  );
};

export default Card1;
