import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
  degen,
} from "wagmi/chains";
import {
  darkTheme,
  getDefaultConfig,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import Navbar_comp from "../components/Navbar_comp";
import { GoogleTagManager } from "@next/third-parties/google";


const config = getDefaultConfig({
  appName: "Airdrop Hunters",
  projectId: "db1b8a46ffa835bd9a48a89ff540f990",
  chains: [
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    baseSepolia,
    degen,
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
           
            <GoogleTagManager gtmId="G-TQV3B868Q6" />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}

export default MyApp;
