"use client";
import React from "react";
import styles from "./page.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>About Awaaz</h1>
          <p className={styles.subtitle}>
            Empowering citizens to make their voices heard
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Purpose</h2>
            <p className={styles.description}>
              Awaaz is a citizen-centric platform designed to bridge the gap
              between communities and local authorities. We believe that every
              voice matters and every concern deserves attention. Through our
              platform, citizens can easily report issues, track their
              resolution progress, and actively participate in improving their
              communities.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Aim</h2>
            <p className={styles.description}>
              Our primary aim is to create a transparent, efficient, and
              user-friendly system that enables citizens to:
            </p>
            <ul className={styles.list}>
              <li>Report civic issues quickly and effectively</li>
              <li>Track the status of their submitted complaints</li>
              <li>Engage with local authorities in a meaningful way</li>
              <li>Build stronger, more responsive communities</li>
              <li>Promote accountability and transparency in governance</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Key Features</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3>Easy Issue Reporting</h3>
                <p>
                  Submit issues with detailed descriptions, categories, and
                  location information
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Real-time Tracking</h3>
                <p>
                  Monitor the progress of your submitted issues from submission
                  to resolution
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Priority Classification</h3>
                <p>
                  Issues are automatically categorized by urgency and importance
                  for efficient handling
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Admin Dashboard</h3>
                <p>
                  Comprehensive management system for authorities to handle and
                  resolve citizen concerns
                </p>
              </div>
              <div className={styles.feature}>
                <h3>User-Friendly Interface</h3>
                <p>
                  Intuitive design that makes it easy for citizens of all
                  technical backgrounds to participate
                </p>
              </div>
              <div className={styles.feature}>
                <h3>Secure & Reliable</h3>
                <p>
                  Built with robust security measures to protect user data and
                  ensure system reliability
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Built for Innovation</h2>
            <div className={styles.hackathonBanner}>
              <h3>🏆 Hackathon Project</h3>
              <p>
                This project was developed as part of the{" "}
                <strong>Odoo and CGC-Janjeri Hackathon </strong>
                Pre elimination round, showcasing innovative solutions for civic
                engagement and community development.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Technology Stack</h2>
            <p className={styles.description}>
              Awaaz is built using modern, scalable technologies including
              Next.js, React, TypeScript, MongoDB, and JWT authentication,
              ensuring a robust and secure platform for all users.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
