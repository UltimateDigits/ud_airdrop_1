// components/Popup.tsx

import { useEffect } from "react";
import styles from "../styles/Popup.module.css";

interface PopupProps {
  message: string;
  heading: string;
  onClose: () => void;
}

const Popup = ({ message, heading, onClose }: PopupProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 8000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>{heading}</h2>
        <p>{message}</p>
        <button onClick={onClose}>&times;</button> {/* Close button as an "X" icon */}
      </div>
    </div>
  );
};

export default Popup;
