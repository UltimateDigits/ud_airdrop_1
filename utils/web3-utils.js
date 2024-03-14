import {
    createPublicClient,
    http,
    parseAbi
} from "viem";
import {
    polygonMumbai
} from "viem/chains";
//TODO: @adielliot37 change to prod data
const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http()
})


export const check_nft_ownership = async (address) => {
    const balance = await publicClient.readContract({
        address: '0x412a0433893F58c0DC7e7B3E064280FE3e835386',
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address],
    });

    if(Number(balance) == 0){
        return false
    }
    return true;
}
