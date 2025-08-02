"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Issue {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  createdAt: string;
  userEmail: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear the admin token/cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie =
        "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

      // Call logout API if exists
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to admin login
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if API fails
      router.push("/admin-login");
    }
  };

  const fetchAllIssues = async () => {
    try {
      const response = await fetch("/api/tickets?admin=true");

      if (response.ok) {
        const data = await response.json();
        setIssues(data.tickets || []);
      } else {
        setError("Failed to fetch issues");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });

      if (response.ok) {
        // Refresh the issues
        fetchAllIssues();
      } else {
        alert("Failed to update issue status");
      }
    } catch {
      alert("Error updating issue status");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "open";
      case "in_progress":
        return "inProgress";
      case "resolved":
        return "resolved";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true;
    return issue.status === filter;
  });

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === "open").length,
    inProgress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  if (loading) {
    return <div className={styles.loading}>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage all citizen issues</p>
          </div>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Logout from admin panel"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Issues</h3>
          <span className={styles.statNumber}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <h3>Open Issues</h3>
          <span className={`${styles.statNumber} ${styles.open}`}>
            {stats.open}
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>In Progress</h3>
          <span className={`${styles.statNumber} ${styles.inProgress}`}>
            {stats.inProgress}
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>Resolved</h3>
          <span className={`${styles.statNumber} ${styles.resolved}`}>
            {stats.resolved}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className={styles.controls}>
        <select
          className={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          title="Filter issues by status"
        >
          <option value="all">All Issues</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Issues List */}
      <div className={styles.issuesList}>
        {filteredIssues.length === 0 ? (
          <div className={styles.noIssues}>No issues found</div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue._id} className={styles.issueCard}>
              <div className={styles.issueHeader}>
                <h3>{issue.title}</h3>
                <div className={styles.statusActions}>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[getStatusClass(issue.status)]
                    }`}
                  >
                    {issue.status.replace("_", " ").toUpperCase()}
                  </span>
                  <select
                    className={styles.statusSelect}
                    value={issue.status}
                    onChange={(e) =>
                      updateIssueStatus(issue._id, e.target.value)
                    }
                    title="Update issue status"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className={styles.issueDetails}>
                <p>{issue.description}</p>

                <div className={styles.metaInfo}>
                  <span>
                    <strong>Category:</strong> {issue.category}
                  </span>
                  <span>
                    <strong>Location:</strong>{" "}
                    {typeof issue.location === "object"
                      ? JSON.stringify(issue.location)
                      : issue.location}
                  </span>
                  <span>
                    <strong>Reported by:</strong> {issue.userEmail}
                  </span>
                  <span>
                    <strong>Date:</strong> {formatDate(issue.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
