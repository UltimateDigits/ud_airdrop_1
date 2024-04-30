import {
    createPublicClient,
    http,
    parseAbi
} from "viem";
import {

    baseSepolia,base,
    mainnet,degen
} from "viem/chains";
//TODO: @adielliot37 change to prod data
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