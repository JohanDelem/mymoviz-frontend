import React, { createContext, useState, useEffect } from "react";
export const AppContext = createContext(null);


const AppContextProvider = (props) => {
  const [mode, setMode] = useState("FR");


    
  const contextValue = {
    mode,
    setMode,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;