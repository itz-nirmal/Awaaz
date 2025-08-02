"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./users.module.css";

interface User {
  _id: string;
  email: string;
  name: string;
  userType: "admin" | "citizen";
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  isVerified?: boolean;
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError("Failed to fetch users");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
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
        <h1>User Management</h1>
        <p>Manage all registered users</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <span className={styles.statNumber}>{users.length}</span>
        </div>
        <div className={styles.statCard}>
          <h3>Citizens</h3>
          <span className={styles.statNumber}>
            {users.filter((u) => u.userType === "citizen").length}
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>Admins</h3>
          <span className={styles.statNumber}>
            {users.filter((u) => u.userType === "admin").length}
          </span>
        </div>
      </div>

      <div className={styles.usersList}>
        {users.length === 0 ? (
          <div className={styles.noUsers}>No users found</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className={styles.userCard}>
              <div className={styles.userHeader}>
                <div className={styles.userInfo}>
                  <h3>{user.name}</h3>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
                <div className={styles.userType}>
                  <span
                    className={`${styles.typeTag} ${styles[user.userType]}`}
                  >
                    {user.userType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className={styles.userDetails}>
                {user.phoneNumber && (
                  <div className={styles.detail}>
                    <strong>Phone:</strong> {user.phoneNumber}
                  </div>
                )}
                {user.address && (
                  <div className={styles.detail}>
                    <strong>Address:</strong> {user.address}
                  </div>
                )}
                <div className={styles.detail}>
                  <strong>Joined:</strong> {formatDate(user.createdAt)}
                </div>
                {user.isVerified !== undefined && (
                  <div className={styles.detail}>
                    <strong>Status:</strong>
                    <span
                      className={
                        user.isVerified ? styles.verified : styles.unverified
                      }
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
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
