import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("shopwise-theme") === "dark");
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; localStorage.setItem("shopwise-theme", dark ? "dark" : "light"); }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
