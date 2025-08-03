"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./tickets.module.css";

interface Issue {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string | { address: string };
  createdAt: string;
  userEmail: string;
  resolution?: string;
  images?: string[];
}

export default function TicketManagement() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [resolutionMessage, setResolutionMessage] = useState("");

  useEffect(() => {
    fetchAllIssues();
  }, []);

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

  const updateIssueStatus = async (
    ticketId: string,
    status: string,
    resolution?: string
  ) => {
    try {
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
          status,
          resolution: resolution || undefined,
        }),
      });

      if (response.ok) {
        // Refresh the issues
        fetchAllIssues();
        setEditingTicket(null);
        setResolutionMessage("");
      } else {
        alert("Failed to update issue status");
      }
    } catch {
      alert("Error updating issue status");
    }
  };

  const startEditing = (ticketId: string, currentStatus: string) => {
    setEditingTicket(ticketId);
    setNewStatus(currentStatus);
    setResolutionMessage("");
  };

  const cancelEditing = () => {
    setEditingTicket(null);
    setNewStatus("");
    setResolutionMessage("");
  };

  const saveChanges = () => {
    if (editingTicket) {
      updateIssueStatus(editingTicket, newStatus, resolutionMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return styles.statusOpen;
      case "in_progress":
        return styles.statusInProgress;
      case "resolved":
        return styles.statusResolved;
      case "invalid":
        return styles.statusInvalid;
      default:
        return styles.statusDefault;
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
    invalid: issues.filter((i) => i.status === "invalid").length,
  };

  if (loading) {
    return <div className={styles.loading}>Loading tickets...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => router.push("/admin-dashboard")}
          className={styles.backButton}
        >
          ← Back to Admin Dashboard
        </button>
        <h1>Ticket Management</h1>
        <p>Review and manage all citizen issues</p>
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
        <div className={styles.statCard}>
          <h3>Invalid</h3>
          <span className={`${styles.statNumber} ${styles.invalid}`}>
            {stats.invalid}
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
          <option value="invalid">Invalid</option>
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
                    className={`${styles.statusBadge} ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status.replace("_", " ").toUpperCase()}
                  </span>
                  {editingTicket === issue._id ? (
                    <div className={styles.editControls}>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className={styles.statusSelect}
                        title="Select new status"
                        aria-label="Select new status"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="invalid">Invalid</option>
                      </select>
                      <button
                        onClick={saveChanges}
                        className={styles.saveButton}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(issue._id, issue.status)}
                      className={styles.editButton}
                    >
                      Edit Status
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.issueDetails}>
                <p>{issue.description}</p>

                {/* Display Images if available */}
                {issue.images && issue.images.length > 0 && (
                  <div className={styles.imagesSection}>
                    <strong>Attached Images:</strong>
                    <div className={styles.imageGrid}>
                      {issue.images.map((imageUrl, index) => (
                        <div key={index} className={styles.imageWrapper}>
                          <Image
                            src={imageUrl}
                            alt={`Issue image ${index + 1}`}
                            className={styles.issueImage}
                            width={200}
                            height={150}
                            style={{ objectFit: "cover", cursor: "pointer" }}
                            onClick={() => window.open(imageUrl, "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.metaInfo}>
                  <span>
                    <strong>Category:</strong> {issue.category}
                  </span>
                  <span>
                    <strong>Location:</strong>{" "}
                    {typeof issue.location === "object"
                      ? issue.location.address || "Address not provided"
                      : issue.location || "Address not provided"}
                  </span>
                  <span>
                    <strong>Reported by:</strong> {issue.userEmail}
                  </span>
                  <span>
                    <strong>Date:</strong> {formatDate(issue.createdAt)}
                  </span>
                </div>

                {issue.resolution && (
                  <div className={styles.resolutionBox}>
                    <strong>Resolution:</strong>
                    <p>{issue.resolution}</p>
                  </div>
                )}

                {editingTicket === issue._id && (
                  <div className={styles.resolutionInput}>
                    <label htmlFor="resolution">Resolution Message:</label>
                    <textarea
                      id="resolution"
                      value={resolutionMessage}
                      onChange={(e) => setResolutionMessage(e.target.value)}
                      placeholder="Enter resolution details..."
                      className={styles.resolutionTextarea}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
