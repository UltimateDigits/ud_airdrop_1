import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { NaboxcheckAddress, checkNaboxWalletAddress, check_nft_ownership, kim_mode, mode_balance, swap_mode, unicorn_NFT } from "../utils/web3-utils";
import { check_nft_ownership1 } from "../utils/web3-utils";
import { degen_token } from "../utils/web3-utils";
import { degen_NFT } from "../utils/web3-utils";
import { manta_token_bsc } from "../utils/web3-utils"
import { manta_nominator } from "../utils/web3-utils"
import { manta_token_pacific } from "../utils/web3-utils"
import MintModal from "./MintModal";
import {native_token_balance_degen_chain} from "../utils/web3-utils";

const rows = [
  {
    key: 1,
    Quest: "Join Our Discord",
    Points: "100 Ultimate Points",
    de1: "Join and get verified on Discord.",
    link: "https://discord.gg/amewkxzs7J",
  },
  {
    key: 2,
    Quest: "Daily Discord Check-in",
    Points: "10 Ultimate Points",
    de1: "Type /gm and paste your wallet address.",
    de2: "per day",
    actionLink: "https://discord.com/channels/1083617900759371776/1088848310854496337",
  },


  {
    key: 3,
    Quest: "Mint the Ultimate Points Genesis NFT",
    Points: "100 Ultimate Points",
    de1:"Free mint on Base. You can get gas token from Stargate Finance.",
    link: "https://stargate.finance/transfer",
  },
  {
    key: 4,
    Quest: "HODL the Ultimate Points Genesis NFT",
    Points: "10 Ultimate Points",
    de1:"Free mint on Base. You can get gas token from Stargate Finance.",
    link: "https://stargate.finance/transfer",
    de2:"per day",
  },

  {
    key: 11, 
    Quest: "Mint your free virtual Unicorn mobile number NFT(+999-U2U-XXXX) ",
    Points: "1500 Ultimate Points",
    de1: "Mint NFT for free on the Unicorn Ultra Nebulas Testnet. Qualify for a $U2U + $ULT airdrop.",
    link: "u2unetwork.ultimatedigits.com",
    de2: "per NFT",
    isNew: true,
   
  },
  
  {
    key: 12,
    Quest: "HODL your Unicorn virtual mobile number NFT",
    Points: "100 Ultimate Points",
    de1: "Claim points every 24 hours for simply holding this free NFT.",
    de2: "per day",
    isNew: true,

  },

  // {
  //   key: 13, 
  //   Quest: "HODL $MODE in Nabox Wallet to earn daily rewards",
  //   Points: "2 Ultimate Points",
  //   de1: "2 Ultimate Points daily for every $MODE token held in your Nabox Wallet. Claim every 24 hours. ",
  //   link: "https://play.google.com/store/apps/details?id=com.wallet.nabox&hl=en_IN",
  //   de2: "per $MODE",
  //   isNew: true 
  // },

  // {
  //   key: 14, 
  //   Quest: "Stake $MODE on Kim Exchange",
  //   Points: "2 Ultimate Points",
  //   de1: "2 Ultimate Points for every LP token from KIM/MODE pool ",
  //   link: "https://app.kim.exchange/pools/v4",
  //   de2: "per LP token",
  //   isNew: true 
  // },

  // {
  //   key: 15, 
  //   Quest: "Stake $MODE on SwapMode",
  //   Points: "2 Ultimate Points",
  //   de1: "2 Ultimate Points for every LP token from SMD/MODE pool ",
  //   link: "http://swapmode.fi/pool/v3/34443-0x85e501b6b8bdddfd6cb6397f502b212344dae3ac",
  //   de2: "per LP token",
  //   isNew: true 
  // },
  


  {
    key: 9,
    Quest: "Stake $MANTA to earn daily rewards",
    Points: "4 Ultimate Points",
    de1: " 4 Ultimate Points daily for every $MANTA token staked. Claim every 24 hours.",
    de2: "Per $MANTA staked",
    link: "https://app.manta.network/manta/stake",
    inEnded: true,
   
  },
  {
    key: 10,
    Quest: "HODL $MANTA to earn daily rewards",
    Points: "2 Ultimate Points",
    de1: " 2 Ultimate Points daily for every $MANTA token held in your Polkadot/MANTA wallet. Claim every 24 hours.",
    de2: "Per $MANTA held",
    inEnded: true,
 
  },

  {
    key: 8,
    Quest: "Mint your virtual Degen mobile number (+999-DEGEN-XXXX)",
    Points: "2000 Ultimate Points",
    de1: "Mint NFT on Degen Chain and earn a $DEGEN + $ULT airdrop.",
    link: "https://degen.ultimatedigits.com/", 
    de2: "per NFT",
   
  },

 
 

  {
    key: 5,
    Quest: "Subscribe to our Ultimate Newsletter",
    Points: "250 Ultimate Points",
    de1: "Takes under 1 minute",
    inEnded: true,
  },


  {
    key: 7,
    Quest: "HODL $DEGEN Tokens",
    Points: "2 Ultimate Points",
    de1: "Earn 2 points for every Degen token held, rounded up, every 24 hours.",
    de2: "per DEGEN",
    inEnded : true,
   
  },
  
  {
    key: 6,
    Quest: "HODL Founders of ZoWorld NFTs",
    Points: "200 Ultimate Points",
    de1: "Earn 200 Points/NFT by connecting your ZoWorld wallet. Dive in!",
    de2: "per NFT",
    inEnded: true,
  },

 
  
];

function renderDescription(description, link) {
  return (
    <>
      {description} {link && <span><strong><a href={link} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Link →</a></strong></span>}
    </>
  );
}

function renderQuestName(quest, isNew) {
  return (
    <>
      {isNew && (
        <span className="inline-block mr-2 text-xs font-bold px-3 py-1 bg-green-600 text-white rounded-lg shadow-sm">
          New
        </span>
      )}
      {quest}
    </>
  );
}
const columns = [
  {
    key: "Quest",
    label: "Active Quests",
  },
  {
    key: "Points",
    label: "Ultimate Points",
  },
  {
    key: "Status",
    label: "Status",
  },
];

const checkAddress = async (address) => {
  console.log("Nabox address",address);
  const response = await fetch('/api/checkAddress', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address })
  });
  const data = await response.json();
  return data.found;
};

const TARGET_SERVER_ID = "1083617900759371776";

function isOneDayOld(oldISOString) {
  const oldDate = new Date(oldISOString);

  // Adjust for Indian Standard Time (IST)
  oldDate.setMinutes(oldDate.getMinutes() + 30);

  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 30);

  const difference = currentDate - oldDate;

  const oneDayInMillis = 24 * 60 * 60 * 1000;

  return difference >= oneDayInMillis;
}

const getUserGuilds = async (accessToken) => {
  const response = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (Array.isArray(data)) {
    const isInTargetServer = data?.some(
      (guild) => guild.id === TARGET_SERVER_ID
    );
    return isInTargetServer;
  } else if (data && data.guilds && Array.isArray(data.guilds)) {
    const isInTargetServer = data?.guilds.some(
      (guild) => guild.id === TARGET_SERVER_ID
    );
    return isInTargetServer;
  } else {
    // Handle other response structures or errors
    console.error("Unexpected response structure:", data);
    return false;
  }
};

const TaskList = () => {
  const [userData, setUserData] = useState(null);
  const { isConnected, address } = useAccount();
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [ispOpen, setOpen] = useState(false);
  const openModal = () => {
    setOpen(true);
  };

  const [status, setStatus] = useState({
    1: "Claim Points",
    2: "say /gm on Discord",
    3: "Claim Points",
    4: "Claim Points",
    5: "Subscribe",
    6: "Claim Points",
    7: "Claim Points",
    8: "Claim Points",
    9: "Claim Points",
    10: "Claim Points",
    11: "Claim Points",
    12: "Claim Points",
    13: "Claim Points",
    14: "Claim Points",
    15: "Claim Points",
  });
  const [showMintModal, setShowMintModal] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    const get_data = async () => {
      const res = await fetch(`/api/user/${address}`);
     // console.log("response:", res);
      const data = await res.json();
     // console.log("user-data:", data);
      if (data == null) return;

      setUserData(data);
      if (data.discord_joined_claim) {
        setStatus((oldVal) => ({ ...oldVal, 1: "Already Claimed" }));
      }
    };
    if (isConnected) {
      get_data();
    }
  }, [address, status]);

  const validateEmail = (email) => email.includes("@");

  // This is a conceptual and NOT recommended approach
  const submitEmail = async () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Hypothetical fetch to get all users/emails (NOT recommended in practice)
    const usersResponse = await fetch("/api/user");
    const users = await usersResponse.json();

    // Check if email already exists in the list of users
    const emailExists = users.some((user) => user.email === email);

    if (emailExists) {
      alert(
        "This email is already registered for Newsletter. \nPlease use different email"
      );
      return;
    }

    // Proceed with your existing logic to update the user with the new email
    const response = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: address,
        email: email,
        emailAdded: true,
        totalPts: userData.totalPts + 250,
      }),
    });

    if (response.ok) {
      setStatus((prev) => ({ ...prev, 5: "Points Claimed" }));
      setShowEmailPopup(false);
      alert("Thank you for subscribing!");
    } else {
      alert("Failed to subscribe, please try again.");
    }
  };

  const claimPoints = async (key, actionLink = "") => {
    if (!userData) return;

    switch (key) {
      case 1:

        if (!session) {
          signIn("discord");
          return; // Ensure to return after calling signIn to prevent further execution until the session is established
        }

        setStatus((oldVal) => ({ ...oldVal, 1: "checking..." }));

        // Add check for discord_id being null or empty
        if (!userData.discord_id) {
          console.log("Discord not connected");
          setStatus((oldVal) => ({ ...oldVal, 1: "Connect Discord first" }));
          return; // Stop execution if no Discord ID is linked
        }

        if (userData.discord_joined_claim) {
          setStatus((oldVal) => ({ ...oldVal, 1: "Already Claimed" }));
          return;
        } else if (await getUserGuilds(session.accessToken)) {
          console.log("In here 1");
          //post req to update data
          await fetch("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
              address: address,
              discord_joined_claim: true,
              totalPts: userData.totalPts + 100,
            }),
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          });
          setStatus((oldVal) => ({ ...oldVal, 1: "Points Claimed" }));
          return;
        } else {
          console.log("In here 2");
          setStatus((oldVal) => ({
            ...oldVal,
            1: <a href="https://discord.gg/amewkxzs7J" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Join Server</a>,
          }));
          return;
        }
        break;


        
      case 2:
        if (actionLink) {
          window.open(actionLink, '_blank');
          return;
        }
        break;  

      case 3:
        if (userData.nft_minted_claim) {
          setStatus((oldVal) => ({ ...oldVal, 3: "Already Claimed" }));
          console.log("Already Minted");

          return;
        } else if (await check_nft_ownership(address)) {
          await fetch("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
              address: address,
              nft_minted_claim: true,
              totalPts: userData.totalPts + 100,
            }),
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          });
          console.log("Already minted adding points");

          setStatus((oldVal) => ({ ...oldVal, 3: "Points Claimed" }));
          return;
        } else {
          console.log("Minting NFT");
          setShowMintModal(true); // Open the mint modal
          return;
        }
        break;

      case 4:
        if (!(await check_nft_ownership(address))) {
          setStatus((oldVal) => ({ ...oldVal, 4: "Mint UD NFT First" }));
          return;
        } else if (userData.Latest_NFT_date == null) {
          const pointsToClaim = userData.totalDailyNFTcount + 1;
          await fetch("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
              address: address,
              totalPts: userData.totalPts + 10,
              Latest_NFT_date: new Date(),
              totalDailyNFTcount: pointsToClaim,
            }),
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          });
          setStatus((oldVal) => ({ ...oldVal, 4: "Points Claimed" }));
          return;
        } else if (isOneDayOld(userData.Latest_NFT_date)) {
          await fetch("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
              address: address,
              totalPts: userData.totalPts + 10,
              Latest_NFT_date: new Date(),
            }),
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          });

          setStatus((oldVal) => ({ ...oldVal, 4: "Points Claimed" }));
          return;
        } else {
          const claimedPoints = userData.totalDailyNFTcount * 10;
          setStatus((oldVal) => ({
            ...oldVal,
            4: `Claimed (${claimedPoints} points)`,
          }));
          return;
        }
      default:
        break;

      case 5:
        if (isConnected) {
          if (userData && userData.emailAdded) {
            // If emailAdded is true, it means the user has already subscribed and claimed the points
            setStatus((oldVal) => ({ ...oldVal, 5: "Already Claimed" }));
            alert("You have already subscribed and claimed your points.");
          } else {
            setShowEmailPopup(true);
          }
        }
        break;

      case 6:
        // Inside your existing claimPoints function, for case 6
        const ZoBal = userData.ZoBalance ;
        if (userData.ZoNFTclaimed) {
          setStatus((oldVal) => ({
            ...oldVal,
            6: `Claimed Points (${ZoBal} NFTs)`,
          }));
          return;
        }

        const zoNFTBalance = await check_nft_ownership1(address);
        if (zoNFTBalance === 0) {
          setStatus((oldVal) => ({ ...oldVal, 6: "You don't hold ZoWorldNFT" }));
          return;
        } else {
          // Calculate points based on the actual balance
          const pointsToAdd = 200 * zoNFTBalance;
          await fetch("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
              address: address,
              ZoNFTclaimed: true,
              totalPts: userData.totalPts + pointsToAdd,
              ZoBalance: zoNFTBalance,

            }),
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
            },
          });
          
          setStatus((oldVal) => ({
            ...oldVal,
            6: `Claimed Points (${ZoBal} NFTs)`,
          }));
          return;
        }

        break;


        case 7:
  const balance = await degen_token(address)/1000000000000000000;
  const degen_balance = await native_token_balance_degen_chain(address)/1000000000000000000;

  // const manta_balance_pacific = await manta_token_pacific(address)/1000000000000000000 ;
  // const manta_balance_bsc = await manta_token_bsc(address)/1000000000000000000 ;
//  const nominator1 = await manta_nominator('dfYFKyRWDhPQZYPkurjQksf4kphns55nTg1ccYNAJMdabPQXt')/1000000000000000000 ;
 // const nom2 = Math.ceil(nominator1);
  //console.log("Degen native balance", degen_balance);
 // console.log("manta balance pacific", manta_balance_pacific);
 // console.log("manta balance bsc", manta_balance_bsc);
 // console.log("nom",nom2);
  const roundedBalance_base = Math.ceil(balance);
  const roundedBalance_degen = Math.ceil(degen_balance);
  console.log(`base_chain: ${roundedBalance_base} Degen_chain: ${roundedBalance_degen}`);
  const roundedBalance = roundedBalance_base + roundedBalance_degen ;
  console.log("Total", roundedBalance);
  if (roundedBalance > 0) {
    if (!userData.degen_date || isOneDayOld(userData.degen_date)) {
      const newPoints = roundedBalance * 2;

      const response = await fetch("/api/user/update", {
        method: "POST",
        body: JSON.stringify({
          address: address,
          degen_date: new Date().toISOString(),
          degen_points: (userData.degen_points || 0) + newPoints,
          totalPts: userData.totalPts + newPoints,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setStatus((oldVal) => ({ ...oldVal, 7: `Claimed Points (${newPoints} points)` }));
      } else {
        console.error("Failed to claim points for Degen tokens");
      }
    } else {
      const claimedPoints = userData.degen_points;
      setStatus((oldVal) => ({
        ...oldVal,
        7: `Claimed total (${claimedPoints} points)`,
      }));
    }
  } else {
    // No Degen tokens held
    setStatus((oldVal) => ({ ...oldVal, 7: "You don't hold $DEGEN" }));
    // Avoid updating timestamp and points if no tokens are held
  }
  break;


  case 8:
    const degenpoints = userData.degenNFT;
  if (userData.degenNFTClaimed) {
    setStatus((oldVal) => ({
      ...oldVal,
      
      8: `Already Claimed (${degenpoints} NFTs)`,
    }));
    return;
  }

  const degenNFTBalance = await degen_NFT(address);
  console.log("degenNFT", degenNFTBalance);
  if (degenNFTBalance === 0) {
    setStatus((oldVal) => ({
      ...oldVal,
      8: <a href="https://degen.ultimatedigits.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Mint Now</a>,
    }));
    return;
  }

  const newPoints = 2000 * degenNFTBalance;
  const response = await fetch("/api/user/update", {
    method: "POST",
    body: JSON.stringify({
      address: address,
      degenNFTClaimed: true,
      degenNFT: degenNFTBalance,
      totalPts: userData.totalPts + newPoints,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    setStatus((oldVal) => ({
      ...oldVal,
      8: `Claimed Points (${newPoints} points)`
    }));
  } else {
    console.error("Failed to claim points for DEGEN NFTs");
  }
  break;

  case 9:
        if (!userData.polka_address) {
          setStatus((oldVal) => ({ ...oldVal, 9: "Connect Polkadot Wallet" }));
          return;
        }
        
        const mantaStaked = await manta_nominator(userData.polka_address)/1000000000000000000;
        const mantaStakedAmount = Math.ceil(mantaStaked);
        console.log("Manta Staked", mantaStakedAmount);
        if (mantaStakedAmount === 0) {
          setStatus((oldVal) => ({ ...oldVal, 9: "No MANTA staked" }));
          return;
        }

        const newPoints1 = mantaStakedAmount * 4;
        if (!userData.manta_staked_date || isOneDayOld(userData.manta_staked_date)) {
          const response = await fetch("/api/user/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: address,
              manta_staked_date: new Date().toISOString(),
              manta_staked_points: (userData.manta_staked_points || 0) + newPoints1,
              totalPts: userData.totalPts + newPoints1,
              total_manta_staked: mantaStakedAmount,
            }),
          });

          if (response.ok) {
            setStatus((oldVal) => ({ ...oldVal, 9: `Claimed (${newPoints1} points)` }));
          } else {
            console.error("Failed to claim points for MANTA Stakers");
          }
        } else {
          const claimedPoints = userData.manta_staked_points;
          setStatus((oldVal) => ({
            ...oldVal,
            9: `Claimed total (${claimedPoints} points)`,
          }));
        }
        break;

        case 10:
  
          const manta_balance_pacific = await manta_token_pacific(address)/1000000000000000000 ;
          const manta_balance_bsc = await manta_token_bsc(address)/1000000000000000000 ;
          //const kim = await kim_mode(address);
          //console.log("kim",kim);
          //const swap = await swap_mode(address);
        //console.log("swap",swap);
          // const mode = await mode_balance(address)/1000000000000000000 ;
          // console.log("mode",mode);
        
          //const check_Nabox = await checkAddress(address);
       
          //console.log("Nabox", check_Nabox);
          console.log("manta balance pacific", manta_balance_pacific);
          console.log("manta balance bsc", manta_balance_bsc);
       
          const roundedBalance_pacific = Math.ceil(manta_balance_pacific);
          const roundedBalance_bsc = Math.ceil(manta_balance_bsc);
          console.log(`Pacific: ${roundedBalance_pacific} BSC: ${roundedBalance_bsc}`);
          const totalmanta = roundedBalance_pacific + roundedBalance_bsc ;
          console.log("Total", totalmanta);
          if (totalmanta > 0) {
            if (!userData.manta_date || isOneDayOld(userData.manta_date)) {
              const newPoints_manta = totalmanta * 2;
        
              const response = await fetch("/api/user/update", {
                method: "POST",
                body: JSON.stringify({
                  address: address,
                  manta_date: new Date().toISOString(),
                  manta_points: (userData.manta_points || 0) + newPoints_manta,
                  total_manta: totalmanta,
                  totalPts: userData.totalPts + newPoints_manta,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
        
              if (response.ok) {
                setStatus((oldVal) => ({ ...oldVal, 7: `Claimed Points (${newPoints_manta} points)` }));
              } else {
                console.error("Failed to claim points for MANTA tokens");
              }
            } else {
              const claimedPoints_manta = userData.manta_points;
              setStatus((oldVal) => ({
                ...oldVal,
                10: `Claimed total (${claimedPoints_manta} points)`,
              }));
            }
          } else {
            // No Degen tokens held
            setStatus((oldVal) => ({ ...oldVal, 10: "You don't hold $MANTA" }));
            // Avoid updating timestamp and points if no tokens are held
          }
          break;
          case 11:

          const unipoints = userData.unicorn_nft;
          if (userData.unicornNFTClaimed) {
            setStatus((oldVal) => ({
              ...oldVal,
              
              11: `Already Claimed (${unipoints} NFTs)`,
            }));
            return;
          }

            const unicornNFTBalance = await unicorn_NFT(address);
            if (unicornNFTBalance === 0) {
              setStatus((oldVal) => ({
                ...oldVal,
                11: <a href="u2unetwork.ultimatedigits.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Mint Now</a>,
              }));
              return;
            }
            const newPointsUnicorn = 1500 * unicornNFTBalance;
            const responseUnicorn = await fetch("/api/user/update", {
              method: "POST",
              body: JSON.stringify({
                address: address,
                unicornNFTClaimed: true,
                unicorn_nft: unicornNFTBalance,
                totalPts: userData.totalPts + newPointsUnicorn,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
          
            if (responseUnicorn.ok) {
              setStatus((oldVal) => ({
                ...oldVal,
                11: `Claimed Points (${newPointsUnicorn} points)`
              }));
            } else {
              console.error("Failed to claim points for UNICORN NFTs");
            }
            break;
          
            case 12:
              if (!(await unicorn_NFT(address))) {
                setStatus((oldVal) => ({ ...oldVal, 12: "Mint Unicorn NFT First" }));
                return;
              } else if (!userData.unicorn_daily_date || isOneDayOld(userData.unicorn_daily_date)) {
                const unicornNFTBalance = await unicorn_NFT(address);
                const pointsToClaim = 100 * unicornNFTBalance;
                await fetch("/api/user/update", {
                  method: "POST",
                  body: JSON.stringify({
                    address: address,
                    totalPts: userData.totalPts + pointsToClaim,
                    unicorn_daily_date: new Date(),
                    unicorn_daily_points: userData.unicorn_daily_points + pointsToClaim,
                    totalDailyUnicornNFTcount: userData.totalDailyUnicornNFTcount + 1,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                setStatus((oldVal) => ({ ...oldVal, 12: "Points Claimed" }));
                return;
              } else {
                const claimedPoints = userData.unicorn_nft * 100;
                setStatus((oldVal) => ({
                  ...oldVal,
                  12: `Claimed (${claimedPoints} points)`,
                }));
                return;
              }
             
              break;

              case 13:
                const naboxAddressFound = await checkAddress(address);
                if (!naboxAddressFound) {
                  setStatus((oldVal) => ({ ...oldVal, 13: "No Nabox wallet found" }));
                  return;
                }
          
                if (!userData.nabox_date || isOneDayOld(userData.nabox_date)) {
                  const modebalance1 = await mode_balance(address)/1000000000000000000; 
                  const modeBalance = Math.ceil(modebalance1);
                  const pointsToAdd = modeBalance * 2;
                  console.log("mode Nabox",modeBalance); 
          
                  const claimHistory = userData.nabox_claim_history || [];
          
                  
                  claimHistory.push({
                    timestamp: new Date().toISOString(),
                    modeBalance: modeBalance,
                  });
          
                  const response = await fetch("/api/user/update", {
                    method: "POST",
                    body: JSON.stringify({
                      address: address,
                      nabox_date: new Date().toISOString(),
                      nabox_points: (userData.nabox_points || 0) + pointsToAdd,
                      totalPts: userData.totalPts + pointsToAdd,
                      nabox_claim_history: claimHistory, 
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
          
                  if (response.ok) {
                    setStatus((oldVal) => ({ ...oldVal, 13: `Claimed Points (${pointsToAdd} points)` }));
                  } else {
                    console.error("Failed to claim points for Nabox wallet");
                  }
                } else {
                  const claimedPoints = userData.nabox_points;
                  setStatus((oldVal) => ({
                    ...oldVal,
                    13: `Claimed total (${claimedPoints} points)`,
                  }));
                }
                break;

              
                case 14:
      if (!userData.kim_date || isOneDayOld(userData.kim_date)) {
        const Kimbalance1 = await kim_mode(address);
        const kimBalance = Math.ceil(Kimbalance1);
        console.log("kim",kimBalance)
        
        if (kimBalance === 0) {
          setStatus((oldVal) => ({ ...oldVal, 14: "No LP positions on KIM" }));
          return;
        }
        console
        const pointsToAdd = kimBalance * 2;

        
        const claimHistoryKim = userData.kim_claim_history || [];

    
        claimHistoryKim.push({
          timestamp: new Date().toISOString(),
          modeBalance: kimBalance,
        });

        const responseKim = await fetch("/api/user/update", {
          method: "POST",
          body: JSON.stringify({
            address: address,
            kim_date: new Date().toISOString(),
            kim_points: (userData.kim_points || 0) + pointsToAdd,
            totalPts: userData.totalPts + pointsToAdd,
            kim_claim_history: claimHistoryKim, // Update the array in the database
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (responseKim.ok) {
          setStatus((oldVal) => ({ ...oldVal, 14: `Claimed Points (${pointsToAdd} points)` }));
        } else {
          console.error("Failed to claim points for KIM pool");
        }
      } else {
        const claimedPoints = userData.kim_points;
        setStatus((oldVal) => ({
          ...oldVal,
          14: `Claimed total (${claimedPoints} points)`,
        }));
      }
      break; 
        
      case 15:
      if (!userData.swapmode_date || isOneDayOld(userData.swapmode_date)) {
        const swapmodebal1 = await swap_mode(address);
        const swapmodebal = Math.ceil(swapmodebal1);
        console.log("swapmode",swapmodebal)
        
        if (swapmodebal === 0) {
          setStatus((oldVal) => ({ ...oldVal, 15: "No LP positions on Swapmode" }));
          return;
        }
        console
        const pointsToAdd = swapmodebal * 2;

        
        const claimHistorySwap = userData.swapmode_claim_history || [];

    
        claimHistorySwap.push({
          timestamp: new Date().toISOString(),
          modeBalance: swapmodebal,
        });

        const responseSwap = await fetch("/api/user/update", {
          method: "POST",
          body: JSON.stringify({
            address: address,
            swapmode_date: new Date().toISOString(),
            swap_points: (userData.swap_points || 0) + pointsToAdd,
            totalPts: userData.totalPts + pointsToAdd,
            swapmode_claim_history: claimHistorySwap, 
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (responseSwap.ok) {
          setStatus((oldVal) => ({ ...oldVal, 15: `Claimed Points (${pointsToAdd} points)` }));
        } else {
          console.error("Failed to claim points for Swapmode pool");
        }
      } else {
        const claimedPoints = userData.swap_points;
        setStatus((oldVal) => ({
          ...oldVal,
          15: `Claimed total (${claimedPoints} points)`,
        }));
      }
      break;
    }
  };

  const activeRows = rows.filter(row => !row.inEnded);
  const endedRows = rows.filter(row => row.inEnded);
    
  
  const renderRows = (rows, isEnded = false) => {
    return rows.map((row) => (
      <tr className="bg-none text-white text-[18px]" key={row.key}>
        <td className="px-8 py-4">
          {renderQuestName(row.Quest, row.isNew)}
          <div className="text-white text-[12px]">
            {renderDescription(row.de1, row.link)}
          </div>
        </td>
        <td className="px-8 py-4">
          {row.Points}
          <div className="px-1 text-white text-[12px]">{row.de2}</div>
        </td>
        <td className="px-8 py-4">
          {isClient && isConnected ? (
            <button
              className={`px-4 py-2 text-white font-bold rounded-full transition duration-300 ${isEnded ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`}
              onClick={() => !isEnded && claimPoints(row.key, row.actionLink)}
              disabled={isEnded}
            >
              {status[row.key]}
            </button>
          ) : (
            "*****"
          )}
        </td>
      </tr>
    ));
  };


  return (
    <>
      {isClient && (  // Only render table on the client
        <div className="relative w-[70%] overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <caption className="px-8 pt-10 text-[42px] text-left text-white">
              Quests for Season 2
              <hr className="mt-10 mb-5 border-gray-400" />
            </caption>
            <thead className="text-[22px] text-gray-100">
              <tr>
                {columns.map((column) => (
                  <th scope="col" className="px-8 py-3 border-b border-gray-700" key={column.key}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {renderRows(activeRows)}
            </tbody>
            <tr>
              <td colSpan={3}>
                <hr className="my-5 border-gray-400" />
              </td>
            </tr>
            <thead className="text-[22px] text-gray-100">
              <tr>
                <th scope="col" className="px-8 py-3 border-b border-gray-700" colSpan={3}>
                  Ended Quests
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {renderRows(endedRows, true)}
            </tbody>
          </table>
        </div>
      )}
      {showMintModal && (
        <MintModal
          closeModal={() => setShowMintModal((prev) => !prev)}
          setStatus={setStatus}
        />
      )}
      {showEmailPopup && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        >
          <div className="relative mx-auto p-5 border shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Subscribe to Newsletter
              </h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="email"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="submit-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={submitEmail}
                >
                  Subscribe
                </button>
                <button
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setShowEmailPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;