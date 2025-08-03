"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/Toast";
import styles from "./page.module.css";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { showToast } = useToast();
  const [animatedStats, setAnimatedStats] = useState({
    reported: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Animation for counting up statistics
  const animateCount = useCallback(
    (target: number, key: keyof typeof animatedStats) => {
      let current = 0;
      const increment = target / 50; // 50 steps for smooth animation
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedStats((prev) => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, 30); // 30ms interval for smooth animation
    },
    []
  );

  // Define fetchUserStats before using it in useEffect
  const fetchUserStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/tickets?userEmail=${user?.email}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const reported =
          data.tickets?.filter((t: { status: string }) => t.status === "open")
            .length || 0;
        const inProgress =
          data.tickets?.filter(
            (t: { status: string }) => t.status === "in_progress"
          ).length || 0;
        const resolved =
          data.tickets?.filter(
            (t: { status: string }) => t.status === "resolved"
          ).length || 0;

        // Start animations with delays
        setTimeout(() => animateCount(reported, "reported"), 300);
        setTimeout(() => animateCount(inProgress, "inProgress"), 600);
        setTimeout(() => animateCount(resolved, "resolved"), 900);
      }
    } catch {
      console.error("Error fetching stats");
    }
  }, [user?.email, animateCount]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/citizen-login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch user statistics when component mounts
    if (user) {
      fetchUserStats();
    }
  }, [user, fetchUserStats]);

  // Handle logout
  const handleLogout = async () => {
    showToast("Logging out...", "info", 2000);

    // Force clear the token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      console.log("Logout API call failed, but cookie cleared");
    }

    await logout();
    showToast("Successfully logged out!", "success", 3000);
    setTimeout(() => {
      router.push("/citizen-login");
    }, 1000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Citizen Dashboard</h1>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.welcomeCard}>
        <h2>Welcome back, {user.name}!</h2>
        <p>Email: {user.email}</p>
        {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
      </div>

      {/* Statistics Cards with Animation */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{animatedStats.reported}</div>
          <div className={styles.statLabel}>Reported Issues</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{animatedStats.inProgress}</div>
          <div className={styles.statLabel}>In Progress</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{animatedStats.resolved}</div>
          <div className={styles.statLabel}>Resolved Issues</div>
        </div>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h3>Report Issue</h3>
          <p>Report civic issues in your area</p>
          <button
            className={styles.actionButton}
            onClick={() => router.push("/dashboard/create-issue")}
          >
            Create New Issue
          </button>
        </div>

        <div className={styles.featureCard}>
          <h3>My Issues</h3>
          <p>Track your reported issues</p>
          <button
            className={styles.actionButton}
            onClick={() => router.push("/dashboard/my-issues")}
          >
            View My Issues
          </button>
        </div>

        <div className={styles.featureCard}>
          <h3>Community Issues</h3>
          <p>Browse community-reported issues</p>
          <button
            className={styles.actionButton}
            onClick={() => router.push("/dashboard/community-issues")}
          >
            Browse Issues
          </button>
        </div>

        <div className={styles.featureCard}>
          <h3>Profile Settings</h3>
          <p>Manage your account settings</p>
          <button
            className={styles.actionButton}
            onClick={() => router.push("/dashboard/profile")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
