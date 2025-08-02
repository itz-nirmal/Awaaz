"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./page.module.css";

interface Issue {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyIssues() {
  const router = useRouter();
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/citizen-login");
      return;
    }

    fetchMyIssues();
  }, [user, router]);

  const fetchMyIssues = async () => {
    try {
      const response = await fetch(`/api/tickets?userId=${user?._id}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIssues(data.tickets || []);
      } else {
        setError("Failed to fetch your issues");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#ff6b6b";
      case "in_progress":
        return "#ffd93d";
      case "resolved":
        return "#6bcf7f";
      default:
        return "#fff";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => router.push("/dashboard")}
          className={styles.backButton}
        >
          ← Back to Dashboard
        </button>
        <h1 className={styles.title}>My Issues</h1>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading your issues...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.content}>
          {issues.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No Issues Reported Yet</h3>
              <p>
                You haven't reported any issues yet. Start by creating your
                first issue!
              </p>
              <button
                onClick={() => router.push("/dashboard/create-issue")}
                className={styles.createButton}
              >
                Create New Issue
              </button>
            </div>
          ) : (
            <div className={styles.issuesGrid}>
              {issues.map((issue) => (
                <div key={issue._id} className={styles.issueCard}>
                  <div className={styles.issueHeader}>
                    <h3 className={styles.issueTitle}>{issue.title}</h3>
                    <span
                      className={styles.statusBadge}
                      style={{ background: getStatusColor(issue.status) }}
                    >
                      {getStatusText(issue.status)}
                    </span>
                  </div>

                  <p className={styles.issueDescription}>{issue.description}</p>

                  <div className={styles.issueDetails}>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Category:</span>
                      <span className={styles.detailValue}>
                        {issue.category}
                      </span>
                    </div>

                    {issue.location && (
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Location:</span>
                        <span className={styles.detailValue}>
                          {issue.location}
                        </span>
                      </div>
                    )}

                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Reported:</span>
                      <span className={styles.detailValue}>
                        {formatDate(issue.createdAt)}
                      </span>
                    </div>

                    {issue.updatedAt !== issue.createdAt && (
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>
                          Last Updated:
                        </span>
                        <span className={styles.detailValue}>
                          {formatDate(issue.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.issueActions}>
                    <button className={styles.viewButton}>View Details</button>
                    {issue.status === "open" && (
                      <button className={styles.editButton}>Edit Issue</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
