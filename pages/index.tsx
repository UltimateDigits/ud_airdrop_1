// pages/index.tsx

import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Card1 from "../components/Card1";
import Card2 from "../components/Card2";
import Card3 from "../components/Card3";
import TaskList from "../components/TaskList";
import { Session } from "next-auth";
import fav from "./favicon.ico";
import { StaticImageData } from "next/image";
import ScreenSizeWarning from "../components/ScreenSizeWarning";
import Popup from "../components/Popup";
interface CustomSession extends Session {
  accessToken?: string; // Define the accessToken property
}

const Home = () => {
  const { isConnected, address } = useAccount();
  const [targetServer, setTargetServer] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const { data: session } = useSession();
  const customSession = session as CustomSession;
  const TARGET_SERVER_ID = "635865020172861441";

  if (session && !targetServer) {
    fetch("https://discord.com/api/v9/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${customSession?.accessToken}`,
      },
    }).then(async (res: any) => {
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (Array.isArray(data)) {
        const isInTargetServer = data?.some(
          (guild: { id: string }) => guild.id === TARGET_SERVER_ID
        );
        if (isInTargetServer) {
          setTargetServer(true);
        }
        return;
      } else if (data && data.guilds && Array.isArray(data.guilds)) {
        const isInTargetServer = data?.guilds.some(
          (guild: { id: string }) => guild.id === TARGET_SERVER_ID
        );
        if (isInTargetServer) {
          setTargetServer(true);
        }
        return;
      } else {
        // Handle other response structures or errors
        console.error("Unexpected response structure:", data);
        return;
      }
    });
  }

  const signin = async () => {
    await signIn("discord");
  };

  return (
    <div className={styles.container}>
      <ScreenSizeWarning />
      <Head>
        <title>Ultimate Airdrop - Farm $ULT</title>
        <meta content="Airdrop site" name="description" />
        <link
          href="https://framerusercontent.com/images/kqpEjtcCnXlCFGRaBKxXTkhc.svg"
          rel="shortcut icon"
        />
      </Head>
      <main className={styles.main}>
        {showPopup && (
          <Popup
            heading="Announcement"
            message="Gm! Season 2 of the Ultimate Points Airdrop has ended. Thank you for your participation. Please stay tuned across our socials for updates and next steps!"
            onClose={() => setShowPopup(false)}
          />
        )}
        <Card3 />
        <Card1 />
        <Card2 />
        <TaskList />
      </main>
    </div>
  );
};

export default Home;
