"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  userType: string;
  isVerified: boolean;
  loginTime: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/admin-verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
        } else {
          router.push("/admin-login");
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        router.push("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Verifying admin access...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
      </div>

      <div className={styles.welcomeCard}>
        <h2>Welcome, {admin?.name}</h2>
        <p>
          <strong>Email:</strong> {admin?.email}
        </p>
        <p>
          <strong>Login Time:</strong>{" "}
          {admin?.loginTime
            ? new Date(admin.loginTime).toLocaleString()
            : "N/A"}
        </p>
        <p>
          <strong>Access Level:</strong> Super Administrator
        </p>
        <div className={styles.securityBadge}>🔒 Secure Admin Access</div>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h3>User Management</h3>
          <p>Manage citizen accounts and permissions</p>
          <button className={styles.actionButton}>Manage Users</button>
        </div>

        <div className={styles.featureCard}>
          <h3>Ticket Management</h3>
          <p>Review and respond to citizen issues</p>
          <button className={styles.actionButton}>View Tickets</button>
        </div>

        <div className={styles.featureCard}>
          <h3>System Analytics</h3>
          <p>View platform usage and statistics</p>
          <button className={styles.actionButton}>View Analytics</button>
        </div>

        <div className={styles.featureCard}>
          <h3>System Settings</h3>
          <p>Configure platform settings and policies</p>
          <button className={styles.actionButton}>Settings</button>
        </div>
      </div>

      <div className={styles.securityNotice}>
        <h4>🔐 Security Notice</h4>
        <p>
          This is a restricted admin area. All actions are logged and monitored.
        </p>
        <p>Admin sessions expire after 24 hours for security.</p>
      </div>
    </div>
  );
}
