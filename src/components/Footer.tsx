"use client";
import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <span>© {new Date().getFullYear()} Awaaz. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
