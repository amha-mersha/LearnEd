import React, { useEffect, useState } from "react";
const logo = require("../public/Images/LearnEd.svg");
import {
  Calendar,
  Home,
  Settings,
  History,
  LogOut,
  Users,
  BarChart,
  BookOpen,
} from "lucide-react";
import Cookie from "js-cookie";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";

const items = [
  {
    title: "Class Rooms",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Study Group",
    url: "/dashboard/study-group",
    icon: Users,
    role: "student",
  },
  {
    title: "Grade Report",
    url: "/dashboard/grade-report",
    icon: BarChart,
    role: "student",
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | undefined>(undefined);
  const { state } = useSidebar();

  useEffect(() => {
    const userRole = Cookie.get("role");
    setRole(userRole);
  }, []);

  return (
    <Sidebar variant="floating" className="w-1/5 fixed h-screen bg-white" collapsible="icon">
      <SidebarHeader>
        {/* Logo Section */}
        {/* <div className="flex justify-center py-6">
          <BookOpen className="w-8 h-8 text-blue-800" />
        </div> */}
        <div className="flex justify-center py-6">
          {state === "expanded" ? (
            <Image src={logo} priority className="w-32 py-4" alt="logo"></Image>
          ) : (
            <BookOpen className="w-8 h-8 text-blue-800" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Application Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
                .filter((item) => !item.role || item.role === role)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url} // Set isActive if the current path matches
                    >
                      <a
                        href={item.url}
                        className={`flex items-center p-2 rounded-lg ${
                          pathname === item.url ? "bg-gray-200 font-bold" : ""
                        }`}
                      >
                        <item.icon className="mr-3 w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/settings"} // Example: Add an active state for settings
            >
              <a
                href="/settings"
                className={`flex items-center p-2 rounded-lg ${
                  pathname === "/settings" ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <Settings className="mr-3 w-5 h-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/logout" className="flex items-center p-2 rounded-lg">
                <LogOut className="mr-3 w-5 h-5" />
                <span>Sign Out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
