import { createContext, useContext } from "react";
import useResponsive from "../utils/responsive";

export const ResponsiveContext = createContext();

export function ResponsiveProvider({ children }) {
  const responsive = useResponsive();

  return (
    <ResponsiveContext.Provider value={responsive}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export const useResponsiveContext = () => useContext(ResponsiveContext);