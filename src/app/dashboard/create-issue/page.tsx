"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../components/Toast";
import styles from "./page.module.css";

export default function CreateIssue() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photos: [] as File[],
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const generateReceipt = (
    issueData: {
      title: string;
      category: string;
      location?: { address: string };
      userEmail?: string;
    },
    ticketId: string
  ) => {
    const receiptData = {
      ticketId: ticketId,
      title: issueData.title,
      category: issueData.category,
      address: issueData.location?.address || "Not specified",
      submittedAt: new Date().toLocaleString(),
      userEmail: user?.email,
      status: "Submitted",
    };

    const receiptText = `
AWAAZ - ISSUE SUBMISSION RECEIPT
================================

Ticket ID: ${receiptData.ticketId}
Title: ${receiptData.title}
Category: ${receiptData.category}
Location: ${receiptData.address}
Submitted By: ${receiptData.userEmail}
Submitted At: ${receiptData.submittedAt}
Status: ${receiptData.status}

Description:
${formData.description}

================================
Thank you for using Awaaz!
Keep this receipt for tracking your issue.
    `;

    const element = document.createElement("a");
    const file = new Blob([receiptText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `awaaz-receipt-${ticketId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Convert photos to base64 for simple storage (for demo purposes)
      const images: string[] = [];

      if (formData.photos.length > 0) {
        for (const photo of formData.photos) {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(photo);
          });
          images.push(await base64Promise);
        }
      }

      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: {
          address: formData.address,
        },
        images: images,
        priority: "medium",
        userEmail: user?.email, // Simple - just use user's email
      };

      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        const ticketId = result.ticketId || result._id || `AWAAZ-${Date.now()}`;

        showToast("Issue submitted successfully! 🎉", "success", 4000);

        // Generate and download receipt
        generateReceipt(submitData, ticketId);

        // Clear form
        setFormData({
          title: "",
          description: "",
          category: "",
          photos: [],
          address: "",
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit issue");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    router.push("/citizen-login");
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
        <h1 className={styles.title}>Create New Issue</h1>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.issueForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Issue Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              className={styles.formInput}
              placeholder="Enter a descriptive title for your issue"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={4}
              className={styles.formInput}
              placeholder="Provide detailed information about the issue"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              required
              className={styles.formInput}
            >
              <option value="">Select Category</option>
              <option value="infrastructure">Roads & Infrastructure</option>
              <option value="utilities">Water Supply & Utilities</option>
              <option value="safety">Public Safety</option>
              <option value="environment">Environment</option>
              <option value="transport">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              required
              placeholder="Enter the complete address where the issue is located"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="photos">Photos (Optional)</label>
            <input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className={styles.formInput}
            />
            {formData.photos.length > 0 && (
              <p className={styles.photoCount}>
                {formData.photos.length} photo(s) selected
              </p>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
