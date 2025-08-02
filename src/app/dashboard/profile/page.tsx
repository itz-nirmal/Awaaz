"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./page.module.css";

export default function Profile() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      router.push("/citizen-login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        setSuccess("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update profile");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className={styles.title}>Profile Settings</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "profile" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "password" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "profile" && (
            <div className={styles.profileSection}>
              <h2>Personal Information</h2>
              <form onSubmit={handleProfileUpdate} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className={styles.formInput}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className={`${styles.formInput} ${styles.disabled}`}
                    title="Email cannot be changed"
                  />
                  <small className={styles.helpText}>
                    Email address cannot be changed. Contact support if needed.
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className={styles.formInput}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    rows={3}
                    className={styles.formInput}
                    placeholder="Enter your address"
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className={styles.passwordSection}>
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordUpdate} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Current Password *</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                    className={styles.formInput}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password *</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                    className={styles.formInput}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">
                    Confirm New Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                    className={styles.formInput}
                    placeholder="Confirm your new password"
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
