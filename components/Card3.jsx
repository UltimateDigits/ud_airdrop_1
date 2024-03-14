import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'; // Modify path as needed
import { useAccount } from 'wagmi'; // Ensure wagmi is properly installed and set up

const Card3 = () => {
    const { isConnected, address } = useAccount();
    const [points, setPoints] = useState(null);

    useEffect(() => {
        if (isConnected && address) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/user/${address}`);
                    const data = await response.json();
                    setPoints(data.totalPts); // Assuming 'totalPts' is the field in your returned json
                } catch (error) {
                    console.error("Failed to fetch points:", error);
                }
            };

            fetchData();
        }
    }, [isConnected, address]); // useEffect will trigger when the connected state or address changes

    // Custom style for the dark gradient background
    const cardStyle = {
        background: 'linear-gradient(to right, #1D1D1D, #0577BB)', // Adjust colors as needed
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        color: '#FFFFFF',
        textAlign: 'left',
        width: '70%',
        marginBottom: '50px',
        minHeight: '200px'
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth", // For smooth scrolling
        });
    };

    return (
        <div className="w-[70%] bg-gradient-to-r from-[#2070f42b] to-[#c6dbff30] text-left p-4 rounded-lg shadow sm:p-8 mb-[40px]">
            <h3 className="text-[30px] text-white">
                Your Ultimate Points <span className="font-bold">[Season 1]</span>
            </h3>
            <div className="my-4">
                <p className="text-[52px] font-bold text-white">
                    {points !== null ? points : '0'}
                </p>
            </div>
            <button
                onClick={scrollToBottom}
                className="text-blue-300 hover:text-blue-500 transition-colors cursor-pointer"
            >
                Earn More Ultimate Points →
            </button>
        </div>
    );
};

export default Card3;