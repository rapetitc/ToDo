import React, { createContext, useEffect, useState } from "react";
import SessionMng from "../Controllers/SessionManager";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  return <ThemeContext.Provider value={{ isLoading, setLoading }}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
