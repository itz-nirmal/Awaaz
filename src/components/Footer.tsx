"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} suppressHydrationWarning={true}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.content}>
          {/* Navigation Links */}
          <div className={styles.section}>
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="/admin-login">Admin Login</Link>
              </li>
              <li>
                <Link href="/citizen-login">Citizen Login</Link>
              </li>
              <li>
                <Link href="/citizen-dashboard">Report an Issue</Link>
              </li>
              <li>
                <Link href="/citizen-dashboard">Track Your Issue</Link>
              </li>
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div className={styles.section}>
            <h3>About</h3>
            <p>
              Awaaz is a modern citizen issue reporting platform built for
              better governance and community engagement.
            </p>
            <div className={styles.techStack}>
              <h4>Built With:</h4>
              <div className={styles.techIcons}>
                <div className={styles.techItem}>
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                    alt="Next.js"
                    width={20}
                    height={20}
                  />
                  <span>Next.js</span>
                </div>
                <div className={styles.techItem}>
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                    alt="React"
                    width={20}
                    height={20}
                  />
                  <span>React</span>
                </div>
                <div className={styles.techItem}>
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                    alt="TypeScript"
                    width={20}
                    height={20}
                  />
                  <span>TypeScript</span>
                </div>
                <div className={styles.techItem}>
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                    alt="MongoDB"
                    width={20}
                    height={20}
                  />
                  <span>MongoDB</span>
                </div>
                <div className={styles.techItem}>
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                    alt="Node.js"
                    width={20}
                    height={20}
                  />
                  <span>Node.js</span>
                </div>
                <div className={styles.techItem}>
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jwt/jwt-original.svg"
                    alt="JWT Auth"
                    width={20}
                    height={20}
                  />
                  <span>JWT Auth</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className={styles.section}>
            <h3>Project</h3>
            <div className={styles.projectLinks}>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubLink}
              >
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                />
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>
            © 2025 Awaaz Platform. This project was developed for a hackathon
            organized by <strong>Odoo</strong> and <strong>CGC Jhanjeri</strong>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
