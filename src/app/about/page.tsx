import React from "react";
import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>About Awaaz</h1>
        <p className={styles.description}>
          Awaaz is a civic engagement platform designed to empower citizens to
          raise issues, track their progress, and work together to solve
          problems in their communities.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Raise Issues</h3>
            <p>Report problems in your city and community with ease.</p>
          </div>
          <div className={styles.feature}>
            <h3>Track Progress</h3>
            <p>Follow up on reported issues and see real-time updates.</p>
          </div>
          <div className={styles.feature}>
            <h3>Collaborate</h3>
            <p>
              Work together with other citizens and officials to find solutions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
