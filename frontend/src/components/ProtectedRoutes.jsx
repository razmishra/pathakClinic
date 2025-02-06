import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const ProtectedRoutes = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = useCallback(
    (event) => {
      // Check if click is outside sidebar and trigger
      const sidebar = document.querySelector('[role="dialog"]');
      if (isOpen && sidebar) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <SidebarProvider>
      <AppSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
      />
      {/* <div className="w-full bg-[#FFFF0]"> */}
      <div className="w-full bg-[#FAF9F6]">
        {/* <div className="w-full bg-[#F0F8FF]"> */}
        <SidebarTrigger onClick={toggleSidebar} />
        <main className="min-h-screen container mx-auto">
          {/* Header */}
          {/* Body */}
          <Outlet />
        </main>
        {/* Footer */}
        <div className="p-10 text-center bg-gray-800 text-white">
          Pathak Clinic
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoutes;
