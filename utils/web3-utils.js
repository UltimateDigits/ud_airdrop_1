import {
    createPublicClient,
    http,
    parseAbi
} from "viem";
import {
    base
} from "viem/chains";
//TODO: @adielliot37 change to prod data
const publicClient = createPublicClient({
    chain: base,
    transport: http()
})


export const check_nft_ownership = async (address) => {
    const balance = await publicClient.readContract({
        address: '0x4B9ac7420AEF7C2071e379fAB1F809d935ff495c',
        abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address],
    });

    if(Number(balance) == 0){
        return false
    }
    return true;
}
