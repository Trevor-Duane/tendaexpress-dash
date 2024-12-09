import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Circles } from "react-loader-spinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext"; 
import { assets } from "../../assets/assets"; // Import your assets
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { apiUrl, setToken, setUser } = useContext(StoreContext); // Get context values
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, data);

      console.log("login home page data", response.data)

      if (response.data.success) {
        setToken(response.data.token);
        // localStorage.setItem("token", response.data.token);

        setUser(response.data.user);
        // localStorage.setItem("userInfo", JSON.stringify(response.data.user));

        // navigate("/"); // Redirect to dashboard after successful login
      } else {
        alert("Login failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountRequestClick = () => {
    navigate("/account_request"); // Navigate to the account request page
  };

  return (
    <div className="login-page home">
      {!isLoading ? (
        <div className="home-container">
          <div className="login-title">
            <img src={assets.logo2} alt="Logo" />
          </div>

          <form onSubmit={handleLogin}>
            <div className="login-inputs">
              <input
                type="email"
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                placeholder="Your email"
                required
              />
              <div className="password-input-container">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={onChangeHandler}
                  placeholder="Password"
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-icon">
                  {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <div className="forgot-password">
              <p>
                <span>Forgot</span> Username or Password
              </p>
            </div>

            <div className="login-button">
              <button type="submit">Login</button>
            </div>
          </form>

          <div className="account-request">
            <p>
              Don't have an account?
              <br />
              <span
                onClick={handleAccountRequestClick}
                style={{ cursor: "pointer", color: "#663399" }}
              >
                Request Account
              </span>
            </p>
          </div>
        </div>
      ) : (
        <Circles
          height="80"
          width="80"
          color="#a020f0"
          ariaLabel="circles-loading"
          visible={true}
        />
      )}
    </div>
  );
};

export default Home;
