"use client";
import React from "react";
import styles from "./team.module.css";

export default function Team() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meet the Team</h1>
          <p className={styles.subtitle}>The passionate minds behind Awaaz</p>
        </div>

        <div className={styles.developmentCard}>
          <div className={styles.cardIcon}>🚧</div>
          <h2 className={styles.cardTitle}>Development in Progress</h2>
          <p className={styles.cardDescription}>
            The team page is currently under development. We have three talented
            individuals building this website who will be revealed soon.
          </p>

          <div className={styles.teamStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Team Members</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>∞</span>
              <span className={styles.statLabel}>Dedication</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>💫</span>
              <span className={styles.statLabel}>Innovation</span>
            </div>
          </div>

          <div className={styles.comingSoon}>
            <h3>Coming Soon</h3>
            <p>
              Individual team member profiles, skills, and contributions will be
              showcased here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
