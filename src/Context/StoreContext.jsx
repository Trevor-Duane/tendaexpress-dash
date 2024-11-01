import React, { useState, useEffect } from "react";

export const StoreContext = React.createContext(null);

const StoreContextProvider = (props) => {
  const apiUrl = "http://localhost:3000"; 
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null); 

  // Optional: Load user data from local storage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserInfo = localStorage.getItem("userInfo")
    if (storedToken && storedUserInfo) {
      setToken(storedToken);
      setUser(JSON.parse(storedUserInfo))
      // Optionally fetch user data here if necessary
    }
  }, []);

  const contextValue = {
    apiUrl,
    token,
    setToken,
    user, // Add user to context value
    setUser, // Function to set user data
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
