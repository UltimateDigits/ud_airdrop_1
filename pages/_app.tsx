import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import Navbar_comp from "../components/Navbar_comp";
// import { http, createConfig } from "@wagmi/core";
// import { base, baseSepolia } from "@wagmi/core/chains";

// export const config = createConfig({
//   chains: [base, baseSepolia],
//   transports: {
//     [base.id]: http(
//       "https://base-sepolia.g.alchemy.com/v2/CIE4zKPNF0FgcNapbXsMjxZiwfodi04_"
//     ),
//     [baseSepolia.id]: http(
//       "https://base-mainnet.g.alchemy.com/v2/1lpy8WVnMciIEdxmUycg9j8gjs4j76tF"
//     ),
//   },
// });
import {
  darkTheme,
  getDefaultConfig,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
  baseSepolia,
} from "wagmi/chains";
const config = getDefaultConfig({
  appName: "UltimateDigits",
  projectId: "ad3662e82ae03a6be909f4ba11b9e4aa",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    sepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [baseSepolia]
      : []),
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#2070F4",
              accentColorForeground: "white",
              borderRadius: "large",
            })}
            coolMode
            modalSize="compact"
          >
            <Navbar_comp />
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}

export default MyApp;
