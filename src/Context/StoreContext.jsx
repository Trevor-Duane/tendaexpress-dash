import React, { useState, useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom";

export const StoreContext = React.createContext(null);

const StoreContextProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  // Load initial token and user info from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedToken && storedUserInfo) {
      setToken(storedToken);
      setUser(JSON.parse(storedUserInfo));
    }
  }, []);

  // Save token and user info to localStorage when they change
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [token, user]);

  // Logout function to clear token and user data
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  };

  const contextValue = {
    apiUrl,
    token,
    setToken,
    user,
    setUser,
    logout,  // Expose the logout functionssss
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
