import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import styles from '../../styles/Home.module.css';
import Head from "next/head";

const columns = [
    {
        key: "Serial",
        label: "#",
    },
    {
        key: "ReferredAddress",
        label: "Referred Address",
    },
    {
        key: "ReferredAt",
        label: "Referred At",
    },
];

type ReferralData = {
    referredAddress: string,
    referredAt: Date,
}

const ReferHistory = () => {
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const { isConnected, address } = useAccount();
    const [showMessage, setShowMessage] = useState(!isConnected);

    useEffect(() => {
        if (isConnected && address) {
            const fetchData = async () => {
                const response = await fetch(`/api/user/${address}`);
                if (response.ok) {
                    const userData = await response.json();
                    const referrals = userData.referrals as ReferralData[]; 
                    const filteredAndSortedReferrals = referrals
                        .filter((ref: ReferralData) => ref.referredAddress) 
                        .sort((a: ReferralData, b: ReferralData) => 
                            new Date(b.referredAt).getTime() - new Date(a.referredAt).getTime()
                        )
                        .slice(0, 15); // Limiting to the top 15 referrals
                    setReferrals(filteredAndSortedReferrals);
                } else {
                    console.error("Failed to fetch user data");
                    setReferrals([]); // Clear referrals in case of error
                }
            };
            fetchData();
        }
    }, [isConnected, address]);

    useEffect(() => {
        setShowMessage(!isConnected);
    }, [isConnected]);

    return (
        <div className={`${styles.main} no-border-box relative`}>
            <Head>
                <title>Recent Referrals</title>
                <meta content="See your recent referrals" name="description" />
                <link href="https://framerusercontent.com/images/kqpEjtcCnXlCFGRaBKxXTkhc.svg" rel="shortcut icon" />
            </Head>
            {showMessage && (
                <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-[1050]">
                    Connect your wallet to see your referral history.
                </div>
            )}
            <div className="relative w-[70%] overflow-x-auto no-border-box">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-gradient-to-l from-[#2070f42b] to-[#c6dbff30]">
                    <caption className="px-8 pt-10 text-[36px] text-left rtl:text-right text-white bg-gradient-to-l from-[#2070f42b] to-[#c6dbff30]">
                        Recent Referrals
                        <hr className="mt-10 mb-5" />
                    </caption>
                    <thead className="text-[22px] bg-inherit text-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th scope="col" className="px-8 py-3" key={column.key}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {referrals.map((referral, index) => (
                            <tr className="bg-inherit text-white text-[18px]" key={index}>
                                <td className="px-8 py-4">{index + 1}</td>
                                <td className="px-8 py-4">{referral.referredAddress}</td>
                                <td className="px-8 py-4">{new Date(referral.referredAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReferHistory;
