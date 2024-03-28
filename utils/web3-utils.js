import {
    createPublicClient,
    http,
    parseAbi
} from "viem";
import {
    baseSepolia
} from "viem/chains";
//TODO: @adielliot37 change to prod data
const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http("https://base-sepolia.g.alchemy.com/v2/CIE4zKPNF0FgcNapbXsMjxZiwfodi04_")
})


export const check_nft_ownership = async (address) => {
    const balance = await publicClient.readContract({
        address: '0x0dFba0575190BA50c2d1FAe1110375D7a5c0DE2b',
        abi: parseAbi(['function balanceOf(address,uint256) view returns (uint256)']),
        functionName: 'balanceOf',
        args: [address, 0],
    });

    if (Number(balance) == 0) {
        return false
    }
    return true;
}
