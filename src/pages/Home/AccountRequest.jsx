import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";
import "./AccountRequest.css";

function AccountRequest() {
  const { apiUrl } = useContext(StoreContext);
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const onAccountChangeHandler = (event) => {
    const { name, value } = event.target;
    setAccountData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAccountRequest = async (e) => {
    e.preventDefault();

    if (!/^[a-zA-Z0-9]+$/.test(accountData.username)) {
      toast.error("Username should only contain letters and numbers.");
      return;
    }

    if (accountData.password !== accountData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        username: accountData.username,
        email: accountData.email,
        address: "TendaCafe",
        mobile: accountData.mobile,
        password: accountData.password,
        confirm_password: accountData.confirmPassword,
      });

      if (response.data.success) {
        toast.success("Account request submitted successfully, now login");
        setAccountData({
            username: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
          });
        //   navigate("/email_verification", { state: { email: accountData.email } })
          navigate("/")
      } else {ssss
        toast.error("Account request failed");
      }
    } catch (error) {
      console.error("Account request error:", error);
      toast.error("An error occurred during account request. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h1>Request Account</h1>
        <form onSubmit={handleAccountRequest}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={accountData.username}
            onChange={onAccountChangeHandler}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={accountData.email}
            onChange={onAccountChangeHandler}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile e.g 070 XXXXXXX"
            value={accountData.mobile}
            onChange={onAccountChangeHandler}
            required
          />
          <div className="password-input">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={accountData.password}
              onChange={onAccountChangeHandler}
              required
            />
            <span onClick={() => setIsPasswordVisible(!isPasswordVisible)} style={{ cursor: "pointer" }}>
              {isPasswordVisible ? "Hide" : "Show"}
            </span>
          </div>
          <div className="password-input">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={accountData.confirmPassword}
              onChange={onAccountChangeHandler}
              required
            />
            <span onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={{ cursor: "pointer" }}>
              {isConfirmPasswordVisible ? "Hide" : "Show"}
            </span>
          </div>
          <button type="submit">Submit Request</button>
          <button type="button" onClick={() => navigate("/")} className="back-to-login">
            Back to Login
          </button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AccountRequest;
