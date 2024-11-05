import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import "./EmailVerification.css";

const EmailVerification = ({ apiUrl }) => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [verificationCode, setVerificationCode] = useState("");

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerification = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/verify-email`, {
        email,
        code: verificationCode,
      });

      if (response.data.success) {
        toast.success("Email verified successfully!");
        // Redirect or perform additional actions
      } else {
        toast.error(response.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("An error occurred during verification. Please try again.");
    }
  };

  return (
    <div className="verification-page">
      <h2>Email Verification</h2>
      <p>Please enter the 6-digit code sent to {email}.</p>
      <form onSubmit={handleVerification}>
        <input
          type="text"
          maxLength="6"
          placeholder="Enter code"
          value={verificationCode}
          onChange={handleCodeChange}
          className="verification-input"
          required
        />
        <button type="submit" className="verification-button">Verify</button>
      </form>
    </div>
  );
};

export default EmailVerification;
