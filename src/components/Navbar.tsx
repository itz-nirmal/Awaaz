"use client";
import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.brand}>Awaaz</Link>
      </div>
      <div className={styles.right}>
        <Link href="/admin-login" className={styles.link}>Administrator Log In</Link>
        <Link href="/citizen-login" className={styles.link}>Citizen Login/Sign Up</Link>
        <Link href="/team" className={styles.link}>Meet the Team</Link>
        <Link href="/about" className={styles.link}>About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
