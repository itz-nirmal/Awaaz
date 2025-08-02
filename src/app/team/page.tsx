import React from "react";
import styles from "../about/page.module.css";

export default function Team() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Meet the Team</h1>
        <p className={styles.description}>
          Meet the passionate individuals behind Awaaz who are working to create
          better civic engagement and community solutions.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Development Team</h3>
            <p>
              Our skilled developers are building the platform with cutting-edge
              technology.
            </p>
          </div>
          <div className={styles.feature}>
            <h3>Design Team</h3>
            <p>
              Creating intuitive and beautiful user experiences for all
              citizens.
            </p>
          </div>
          <div className={styles.feature}>
            <h3>Community Liaisons</h3>
            <p>
              Connecting with local governments and community organizations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
