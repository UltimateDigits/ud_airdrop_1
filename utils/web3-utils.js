import {
    createPublicClient,
    http,
    parseAbi
} from "viem";
import {

    baseSepolia,base,
    mainnet,degen,bsc,manta,mode
} from "viem/chains";

// import fs from 'fs';
// import csv from 'csv-parser';

// const isAddressInNaboxWallet = async (address) => {
//   return new Promise((resolve, reject) => {
//       let found = false;
//       fs.createReadStream('public/data/MODE_BALANCES.csv') // Correct file path
//           .pipe(csv())
//           .on('data', (row) => {
//               // Change 'walletAddress' to the actual column name from your CSV
//               if (row.walletAddress && row.walletAddress.toLowerCase() === address.toLowerCase()) {
//                   found = true;
//               }
//           })
//           .on('end', () => {
//               resolve(found);
//           })
//           .on('error', (err) => {
//               reject(err);
//           });
//   });
// };


const unicornUltraNebulasTestnet = {
  chainId: '0x9b4', // Hexadecimal representation of 2484
  name: 'Unicorn Ultra Nebulas Testnet'
};

const publicClient = createPublicClient({
    chain: base,
    transport: http("https://base-mainnet.g.alchemy.com/v2/wdZKK0jRN3MLdwwl-iC584EwKJtrfE3A")
})

const publicClient1 = createPublicClient({
    chain: mainnet,
    transport: http("https://eth-mainnet.g.alchemy.com/v2/QuvsBXmbep4JiOmQQI-W0b4Kj6MY-GWm")
})

const publicClient2 = createPublicClient({
    chain: base,
    transport: http("https://base-mainnet.g.alchemy.com/v2/2EvLZSldPDl24uXgknt1t7n1MpweBJWh")
})

const publicClient3 = createPublicClient({
    chain: degen,
    transport: http("https://666666666.rpc.thirdweb.com")
})

const publicClient4 = createPublicClient({
  chain: bsc,
  transport: http("https://go.getblock.io/bba7f50d9c2c4fb3b9c7431cea71a83d")
})

const publicClient5 = createPublicClient({
  chain: bsc,
  transport: http("https://lb.drpc.org/ogrpc?network=manta-pacific&dkey=AgqfMulqMUXQikrcuy1whw9xq2CBB8gR75jdQktuFoNr")
})

const publicClientUnicorn = createPublicClient({
  chain: unicornUltraNebulasTestnet,
  transport: http("https://rpc-nebulas-testnet.uniultra.xyz")
});

const publicClient6 = createPublicClient({
  chain: mode,
  transport: http("https://lb.drpc.org/ogrpc?network=mode&dkey=AgqfMulqMUXQikrcuy1whw8hHy5nM5MR76Q1hkHL9tz4")
});

export const check_nft_ownership = async (address) => {
    const balance = await publicClient.readContract({
        address: '0x4B9ac7420AEF7C2071e379fAB1F809d935ff495c', //0x7b53e8f23d2e366d0706a863120590286AF791D8
        abi: parseAbi(['function balanceOf(address,uint256) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address, 0],
    });

    if (Number(balance) == 0) {
        return false
    }
    return true;
}

export const check_nft_ownership1 = async (address) => {
    const balance = await publicClient1.readContract({
      address: '0xF9e631014Ce1759d9B76Ce074D496c3da633BA12',
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [address],
    });
  
    return Number(balance); 
  };
  

  export const degen_token = async (address) => {
    const balance = await publicClient2.readContract({
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [address],
    });
  
    return Number(balance); 
  };

  export const degen_NFT = async (address) => {
    const balance = await publicClient3.readContract({
      address: '0x080dB0b9281e23AF7Df31985B846Ad05a615565E',
      abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [address],
    });
  
    return Number(balance); 
  };

  export const native_token_balance_degen_chain = async (address) => {
    const balance = await publicClient3.getBalance({
        address: address
    });

    return Number(balance);
};

export const manta_token_bsc = async (address) => {
  const balance = await publicClient4.readContract({
    address: '0x8581cc815e40615998f4561f3e24e68066293595',
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [address],
  });

  return Number(balance); 
};

export const manta_token_pacific = async (address) => {
  const balance = await publicClient5.readContract({
    address: '0x95CeF13441Be50d20cA4558CC0a27B601aC544E5',
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [address],
  });

  return Number(balance); 
};

export const manta_nominator = async (address) => {
  try {
      const response = await fetch("https://manta.api.subscan.io/api/scan/staking/nominator", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
      });

      const result = await response.json();
      // Check if the 'data' is not null or undefined
      
      if (result.data) {
          return parseInt(result.data.bonded);
      } else {
          return 0; // If bonded data is missing or not a number
      }
  } catch (error) {
      console.error("Error fetching nominator data:", error);
      return 0; // Return 0 in case of an error
  }
};

export const unicorn_NFT = async (address) => {
  const balance = await publicClientUnicorn.readContract({
    address: '0x3b437Bd80da0197Bfb41e2379bd3DcbECF2Ebe33',
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [address],
  });

  return Number(balance); 
};

export const kim_mode = async (address) => {
  try {
    const response = await fetch('https://api.goldsky.com/api/public/project_clmqdcfcs3f6d2ptj3yp05ndz/subgraphs/Algebra-Kim/0.0.4/gn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query MyQuery {
            positions(where:{pool:"0x86d9d9dd7a2c3146c6fad51646f210cb2e5fc12f", owner:"${address}"}){
              owner
              liquidity
              depositedToken0
              withdrawnToken0
              depositedToken1
              withdrawnToken1
              pool {
                id
                token0 { symbol }
                token1 { symbol }
              }
            }
          }
        `
      })
    });
    const result = await response.json();
    if (result.data && result.data.positions.length > 0) {
      const position = result.data.positions[0];
      return position.depositedToken1 - position.withdrawnToken1;
    } else {
      return 0; // Handle cases where there are no positions or an empty response
    }
  } catch (error) {
    console.error("Error fetching data from Algebra-Kim:", error);
    return 0; // Return 0 in case of an error
  }
};

export const swap_mode = async (address) => {
  try {
    const response = await fetch('https://api.goldsky.com/api/public/project_cltceeuudv1ij01x7ekxhfl46/subgraphs/swapmode-v3/1.0.0/gn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query MyQuery {
            positions(where:{pool:"0x85e501b6b8bdddfd6cb6397f502b212344dae3ac", owner:"${address}"}){
              owner
              liquidity
              depositedToken0
              withdrawnToken0
              depositedToken1
              withdrawnToken1
              pool {
                id
                token0 { symbol }
                token1 { symbol }
              }
            }
          }
        `
      })
    });
    const result = await response.json();
    if (result.data && result.data.positions.length > 0) {
      const position = result.data.positions[0];
      return position.depositedToken0 - position.withdrawnToken0;
    } else {
      return 0; // Handle cases where there are no positions or an empty response
    }
  } catch (error) {
    console.error("Error fetching data from SwapMode:", error);
    return 0; // Return 0 in case of an error
  }
};

export const mode_balance = async (address) => {
  const balance = await publicClient6.readContract({
    address: '0xDfc7C877a950e49D2610114102175A06C2e3167a',
    abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
    functionName: 'balanceOf',
    args: [address],
  });

  return Number(balance); 
};


// export const checkNaboxWalletAddress = async (address) => {
//   try {
//       const exists = await isAddressInNaboxWallet(address);
//       return exists ? "Address found in the CSV file." : "Address not found in the CSV file.";
//   } catch (error) {
//       console.error("Error checking Nabox wallet address:", error);
//       return "An error occurred while checking the address.";
//   }
// };
