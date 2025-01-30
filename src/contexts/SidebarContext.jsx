import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

// Custom hook for using sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider component
export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle window resize
  window.addEventListener("resize", () => {
    setIsMobile(window.innerWidth <= 768);
  });

  const value = {
    isOpen,
    isMobile,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export default SidebarContext;
