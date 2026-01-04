import {
  Home,
  UserRound,
  UserPlus,
  BookOpenCheck,
  Pill,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: UserRound,
  },
  {
    title: "Add Patient",
    url: "/add-patients",
    icon: UserPlus,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Users,
  },
  {
    title: "Examinations",
    url: "/examination",
    icon: BookOpenCheck,
  },
  {
    title: "Drug List",
    url: "/drug-list",
    icon: Pill,
  },
];

export function AppSidebar({ isOpen, setIsOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleMenuClick = (item) => {
    navigate(item.url);
    // onOpenChange(false);
  };
  
  return (
    <Sidebar open={isOpen} className="transition-all duration-800 ease-in-out">
      <SidebarContent>
        <SidebarHeader>
          <header className="flex items-center justify-start gap-6">
            <img src="doctor.png" alt="icon" className="w-12" />
            <span className="font-bold text-2xl">Dr. Pathak</span>
          </header>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* <a href={item.url}> */}
                    <div
                      onClick={() => handleMenuClick(item)}
                      className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 rounded-md 
                               hover:bg-slate-100 transition-all duration-300 ease-in-out
                               hover:translate-x-2"
                    >
                      <item.icon />
                      <span className="text-[17px]">{item.title}</span>
                    </div>
                    {/* </a> */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
