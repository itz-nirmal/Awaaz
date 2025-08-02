"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

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
        console.log("Admin user detected, showing Admin Account link");
        return (
          <Link
            href="/admin-dashboard"
            className={styles.link}
            onClick={closeMobileMenu}
          >
            Admin Account
          </Link>
        );
      } else if (user.userType === "citizen") {
        console.log("Citizen user detected, showing My Account link");
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
    console.log("No user detected, returning null");
    return null;
  };

  const getAuthLinks = () => {
    if (user) {
      // User is logged in - don't show logout button in navbar
      console.log("User is logged in, not showing auth links");
      return null;
    } else {
      // User not logged in - show login links
      console.log("User not logged in, showing login links");
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
  };
  return (
    <nav
      className={styles.navbar}
      ref={navbarRef}
      suppressHydrationWarning={true}
    >
      <div className={styles.left} suppressHydrationWarning={true}>
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
          aria-expanded={isMobileMenuOpen}
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
        key={`navbar-${user?.userType || "guest"}`}
        suppressHydrationWarning={true}
      >
        {mounted && getAccountLink()}
        {mounted && getAuthLinks()}
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
