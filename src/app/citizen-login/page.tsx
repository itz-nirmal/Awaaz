"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import GoogleIcon from "../../components/GoogleIcon";
import styles from "./page.module.css";

export default function CitizenLogin() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        if (result.success) {
          router.push("/dashboard"); // Redirect to citizen dashboard
        } else {
          setError(result.message);
        }
      } else {
        // Register
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: "citizen",
          phoneNumber: formData.phoneNumber,
        });

        if (result.success) {
          alert("Account created successfully! Please login to continue.");
          setIsLogin(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
          });
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    alert("Google authentication will be implemented with OAuth2");
    // In production: implement Google OAuth
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
    setError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isLogin ? "Welcome Back" : "Join Awaaz"}
          </h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "Sign in to your citizen account"
              : "Create your account to start making your voice heard"}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your phone number"
                required={!isLogin}
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading
              ? isLogin
                ? "Signing In..."
                : "Creating Account..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className={styles.googleButton}
          >
            <GoogleIcon className={styles.googleIcon} />
            Continue with Google
          </button>

          {isLogin && (
            <div className={styles.links}>
              <a href="#" className={styles.forgotPassword}>
                Forgot Password?
              </a>
            </div>
          )}
        </form>

        <div className={styles.switchMode}>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className={styles.switchButton}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
