"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getAccountLink = () => {
    if (user) {
      if (user.userType === "admin") {
        return (
          <Link
            href="/admin-dashboard"
            className={styles.link}
            onClick={closeMobileMenu}
          >
            My Account
          </Link>
        );
      } else if (user.userType === "citizen") {
        return (
          <Link
            href="/dashboard"
            className={styles.link}
            onClick={closeMobileMenu}
          >
            My Account
          </Link>
        );
      }
    }
    return null;
  };

  const getAuthLinks = () => {
    // Show login links immediately, don't wait for loading
    if (!user) {
      return (
        <>
          <Link
            href="/admin-login"
            className={styles.link}
            onClick={closeMobileMenu}
          >
            Administrator Log In
          </Link>
          <Link
            href="/citizen-login"
            className={styles.link}
            onClick={closeMobileMenu}
          >
            Citizen Login/Sign Up
          </Link>
        </>
      );
    }
    return null;
  };
  return (
    <nav className={styles.navbar} ref={navbarRef}>
      <div className={styles.left}>
        <Link href="/" className={styles.brand} onClick={closeMobileMenu}>
          <Image
            src="/Logo.png"
            alt="Awaaz Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.brandText}>Awaaz</span>
        </Link>
      </div>

      {isMobile && (
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
        >
          <span
            className={`${styles.hamburger} ${
              isMobileMenuOpen ? styles.open : ""
            }`}
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      <div
        className={`${styles.right} ${
          isMobileMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        {getAccountLink()}
        {getAuthLinks()}
        <Link href="/team" className={styles.link} onClick={closeMobileMenu}>
          Meet the Team
        </Link>
        <Link href="/about" className={styles.link} onClick={closeMobileMenu}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
