import React, { useEffect, useState } from 'react';
import styles from '../../styles/HowTo.module.css';
import Link from 'next/link'; 
import Head from "next/head";

const howto = () => {
    return (
      <div className={styles.container}>
          <Head>
  <title>Ultimate Airdrop - Farm $ULT</title>
  <meta content="Airdrop site" name="description" />
  <link href="https://framerusercontent.com/images/kqpEjtcCnXlCFGRaBKxXTkhc.svg" rel="shortcut icon" />
</Head>
        <h1 className={styles.header}>Get Started with Ultimate Points Program</h1>
        <div className={styles.content}>
          Visit <a href="https://airdrop.ultimatedigits.com" className={styles.link}>airdrop.ultimatedigits.com</a> and connect any wallet to start farming <span className={styles.highlight}>$ULT</span> by completing the specified tasks. Additionally, link your Discord account and join the Ultimate Digits Community Server for Discord-related tasks. If you&apos;re already a server member, still connect your Discord to claim your Ultimate Points.
        </div>
        <div className={styles.content}>
          Maintain consistency in using the same wallet and Discord account throughout the Ultimate Points Program seasons to maximize your points accumulation. Your Ultimate Points balance will update every 24 hours.
        </div>
        <div className={styles.content}>
          For any discrepancies, report via the <span className={styles.highlight}>#get-help</span> channel on our Discord Server or email <a href="mailto:support@ultimatedigits.com" className={styles.link}>support@ultimatedigits.com</a> if you&apos;re not on Discord or can&apos;t join the server.
        </div>
        <div className={styles.footer}>
          Start your journey and maximize your points today!
          <div className={styles.buttonContainer}> 
            <Link href="/" passHref>
            <p className={styles.statusButton}>Start</p>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
 
  

export default howto;
