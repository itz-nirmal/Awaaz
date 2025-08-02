"use client";
import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";

const sloganText = "Raise it · Track it · Solve it";

const Hero: React.FC = () => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    let direction: "forward" | "reset" = "forward";
    const interval = setInterval(() => {
      if (direction === "forward") {
        setTyped(sloganText.slice(0, i + 1));
        i++;
        if (i === sloganText.length) {
          direction = "reset";
          setTimeout(() => {
            i = 0;
            setTyped("");
            direction = "forward";
          }, 1200); // Pause before restarting
        }
      }
    }, 110); // Slower typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Awaaz</h1>
      <div className={styles.tagline}>
        <div className={styles.slogan}><span>{typed}</span><span className={styles.cursor}>{typed.length < sloganText.length ? "|" : ""}</span></div>
        <div className={styles.desc}>Your voice can fix your city. Make it heard with Awaaz.</div>
      </div>
    </section>
  );
};

export default Hero;
