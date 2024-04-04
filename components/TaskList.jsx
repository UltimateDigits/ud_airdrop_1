import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { check_nft_ownership } from "../utils/web3-utils";
import MintModal from "./MintModal";

const rows = [
  {
    key: 1,
    Quest: "Join Our Discord",
    Points: "100 Ultimate Points",
    de1: "Join and get verified on Discord",
  },
  {
    key: 2,
    Quest: "Daily Discord Check-in",
    Points: "10 Ultimate Points",
    de1: "Type /gm and paste your wallet address",
    de2: "per day",
  },
  {
    key: 3,
    Quest: "Mint the Ultimate Points Genesis NFT",
    Points: "100 Ultimate Points",
    de1:"Free mint on Base",
  },
  {
    key: 4,
    Quest: "HODL the Ultimate Points Genesis NFT",
    Points: "10 Ultimate Points",

    de1:"Free mint on Base",
    de2:"per day",
  },

  {
    key: 5,
    Quest: "Subscribe to our Ultimate Newsletter",
    Points: "250 Ultimate Points",
    de1: "Takes under 1 minute",
  },
];

const columns = [
  {
    key: "Quest",
    label: "Quests",
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
  });
  const [showMintModal, setShowMintModal] = useState(false);

  useEffect(() => {
    const get_data = async () => {
      const res = await fetch(`/api/user/${address}`);
      console.log("response:", res);
      const data = await res.json();
      console.log("user-data:", data);
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

  const validateEmail = (email) => email.includes("@gmail.com");

  // This is a conceptual and NOT recommended approach
  const submitEmail = async () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid Gmail address.");
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

  const claimPoints = async (key) => {
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
            1: "Join Server",
          }));
          return;
        }
        break;

      case 3:
        if (userData.nft_minted_claim) {
          setStatus((oldVal) => ({ ...oldVal, 3: "Already Claimed" }));
          console.log("magane...");

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
          console.log("magane madangi ...");

          setStatus((oldVal) => ({ ...oldVal, 3: "Points Claimed" }));
          return;
        } else {
          console.log("magane madangi veru...");
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
    }
  };

  return (
    <>
      <div className="relative w-[70%] overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <caption className="px-8 pt-10 text-[42px] text-left text-gray-900 text-white">
            Quests for Season 1
            <hr className="mt-10 mb-5" />
          </caption>
          <thead className="text-[22px] bg-none text-gray-100">
            <tr>
              {columns.map((column) => (
                <th scope="col" className="px-8 py-3" key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-none text-white text-[18px]" key={row.key}>
                <td className="px-8 py-4">
                  {row.Quest}
                  <div className="text-white text-[12px] ">{row.de1}</div>
                </td>
                <td className="px-8 py-4">
                  {row.Points}
                  <div className="px-1 text-white text-[12px] ">{row.de2}</div>
                </td>
                <td className="px-8 py-4">
                  {isConnected ? (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300"
                      onClick={() => claimPoints(row.key)}
                    >
                      {status[row.key]}
                    </button>
                  ) : (
                    "*****"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMintModal && (
        <MintModal
          closeModal={() => setShowMintModal((prev) => !prev)}
          setStatus={setStatus}
        />
      )}

      {/* <MintModal setStatus={setStatus} /> */}
      {showEmailPopup && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="email-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
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
