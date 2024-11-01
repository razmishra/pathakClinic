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

export function AppSidebar() {
  const navigate = useNavigate()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <header className="flex items-center justify-start gap-6">
            <img src="doctor-icon.svg" alt="icon" className="w-10" />
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
                    <div onClick={()=>navigate(item.url)} className="cursor-pointer">
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
