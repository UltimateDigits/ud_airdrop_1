import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const Logo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const update_referral = async (ref_add, new_user_add) => {
  const resp = await fetch(`/api/user/${ref_add}`);
  const ref_data = await resp.json();

  // Update only if not already referred
  if (!ref_data.alreadyReferred) {
    const referralUpdate = {
      address: ref_add,
      totalRefferals: ref_data.totalRefferals + 1,
      referrals: [
        ...ref_data.referrals,
        { referredAddress: new_user_add, referredAt: new Date().toISOString() }
      ]
    };

    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify(referralUpdate),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};


const Navbar_comp = () => {
  const { isConnected, address } = useAccount();
  const [discordData, setDiscordData] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useAccountEffect({
    onConnect: async (data) => {
      try {
        const res = await fetch(`/api/user/${data.address}`);
        const userData = await res.json();
    
        if (!userData || Object.keys(userData).length === 0) {
          const body = JSON.stringify({
            address: data.address,
            refferedBy: searchParams.get("ref") || undefined,
          });
          const userCreationResponse = await fetch("api/user", {
            method: "POST",
            body: body,
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          // Call update_referral if there is a referrer
          if (searchParams.has("ref")) {
            update_referral(searchParams.get("ref"), data.address);
          }
        } else {
          setDiscordData(userData.discord_id);
        }
      } catch (error) {
        console.error("Error in onConnect:", error);
      }
    },
    
    onDisconnect: () => {
      signOut();
    },
  });

  const update_db_discord = async () => {
    if (!isConnected || !session || discordData !== "") return;

    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
          discord_id: session.user.name,
        }),
      });

      if (response.ok) {
        setDiscordData(session.user.name);
        if (searchParams.has("ref") && !sessionStorage.getItem("referralUpdated")) {
          await update_referral(String(searchParams.get("ref")));
          sessionStorage.setItem("referralUpdated", "true");
        }
      } else {
        const data = await response.json();
        if (data.error && data.error.code === 11000) {
          if (!sessionStorage.getItem("discordLinkErrorShown")) {
            alert("This Discord is already linked to another address.");
            sessionStorage.setItem("discordLinkErrorShown", "true");
          }
        } else {
          console.log("Failed to update Discord ID. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error updating Discord ID:", error);
    }
  };

  useEffect(() => {
    if (session) update_db_discord();
  }, [session, isConnected, address, discordData]);

  return (
    <Navbar
      className="bg-[#00070e1a] text-white font-Inter z-[99] py-5"
      position="sticky"
      maxWidth="xl"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarBrand>
        <a href="https://www.ultimatedigits.com/#home" target="_blank" rel="noopener noreferrer">
          <img src="https://framerusercontent.com/images/6teXonF81p9KsihSjQY4Mwmup70.png?scale-down-to=512" alt="Ultimate Digits" className="h-[30px] md:h-[40px]" />
        </a>
      </NavbarBrand>
  
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={router.pathname == "/"}>
          <Link href="/">Home</Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname == "/leaderboard"}>
          <Link href="/leaderboard">Leaderboard</Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname == "/howto"}>
          <Link href="/howto">How-To</Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname == "/referhistory"}>
          <Link href="/referhistory">Refer History</Link>
        </NavbarItem>
      </NavbarContent>
  
      <NavbarContent justify="end">
        <NavbarItem>
          <ConnectButton chainStatus="icon" showBalance={false} showRecentTransactions={true}/>
        </NavbarItem>
        <NavbarItem>
          {isConnected ? (
            <div
              className="flex items-center justify-between space-x-2 ml-5 bg-inherit h-[45px] p-1 rounded-lg border border-black px-3 cursor-pointer"
              onClick={() => {
                if (discordData === "") {
                  signIn("discord");
                }
              }}
            >
              <Image
                src="https://www.cdnlogo.com/logos/d/15/discord.svg"
                width={30}
                height={30}
                alt="Discord logo"
                unoptimized={true} 
              />
              <p>{discordData === "" ? "Link Discord" : discordData}</p>
            </div>
          ) : (
            <></>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navbar_comp;
