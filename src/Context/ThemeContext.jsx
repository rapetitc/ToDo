import React, { createContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return <ThemeContext.Provider value={{ isLoading, setLoading, isMenuOpen, setMenuOpen }}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
