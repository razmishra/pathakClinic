import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const ProtectedRoutes = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <div className="w-full bg-[#FFFF0]"> */}
      <div className="w-full bg-[#FAF9F6]">
      {/* <div className="w-full bg-[#F0F8FF]"> */}
        <SidebarTrigger />
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
