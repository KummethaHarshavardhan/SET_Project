import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar automatically on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isOpen: false,
      toggleSidebar: () => {},
      closeSidebar: () => {},
      openSidebar: () => {},
    };
  }
  return context;
}
