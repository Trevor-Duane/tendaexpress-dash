import React from "react";

export const StoreContext = React.createContext(null);

const StoreContextProvider = (props) => {
  const apiUrl = "http://api.tendacafe.com";
  const [token, setToken] = React.useState("");

  const contextValue = {
    apiUrl,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
