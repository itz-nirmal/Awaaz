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
  userEmail: string; // Simplified - just store the email directly
}

export default function CommunityIssues() {
  const router = useRouter();
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/citizen-login");
      return;
    }

    fetchCommunityIssues();
  }, [user, router]);

  const fetchCommunityIssues = async () => {
    try {
      const response = await fetch("/api/tickets", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIssues(data.tickets || []);
      } else {
        setError("Failed to fetch community issues");
      }
    } catch {
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

  const filteredIssues = issues.filter((issue) => {
    const matchesFilter = filter === "all" || issue.status === filter;
    const matchesSearch =
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.description.toLowerCase().includes(search.toLowerCase()) ||
      issue.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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
        <h1 className={styles.title}>Community Issues</h1>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search issues by title, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterContainer}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Issues</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading community issues...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.content}>
          {filteredIssues.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No Issues Found</h3>
              <p>
                {search || filter !== "all"
                  ? "No issues match your current search or filter criteria."
                  : "No community issues have been reported yet."}
              </p>
              {!search && filter === "all" && (
                <button
                  onClick={() => router.push("/dashboard/create-issue")}
                  className={styles.createButton}
                >
                  Be the First to Report an Issue
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles.resultsCount}>
                Showing {filteredIssues.length} of {issues.length} issues
              </div>

              <div className={styles.issuesGrid}>
                {filteredIssues.map((issue) => (
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

                    <p className={styles.issueDescription}>
                      {issue.description}
                    </p>

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
                            {typeof issue.location === "object"
                              ? JSON.stringify(issue.location)
                              : issue.location}
                          </span>
                        </div>
                      )}

                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Reported by:</span>
                        <span className={styles.detailValue}>
                          {issue.userEmail || "Anonymous"}
                        </span>
                      </div>

                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Date:</span>
                        <span className={styles.detailValue}>
                          {formatDate(issue.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className={styles.issueActions}>
                      <button className={styles.viewButton}>
                        View Details
                      </button>
                      <button className={styles.supportButton}>
                        👍 Support
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
