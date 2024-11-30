'use client';
import React, { useEffect, useState, useTransition } from "react";
const logo = require("../public/Images/LearnEd.svg");
import {
  Languages,
  Home,
  Settings,
  History,
  LogOut,
  Users,
  BarChart,
  BookOpen,
  ChevronUp,
  User2,
  Check,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { useTranslations } from "next-intl";



export function AppSidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | undefined>(undefined);
  const { state } = useSidebar();
  const [isPending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState<string>('en');
  const t = useTranslations('Sidebar');

  useEffect(() => {
    const userRole = Cookie.get("role");
    const storedLocale = Cookie.get("NEXT_LOCALE") || 'en';
    setRole(userRole);
    setCurrentLocale(storedLocale);
  }, []);

  const handleLocaleChange = (locale: string) => {
    startTransition(() => {
      const typedLocale = locale as Locale;
      setUserLocale(typedLocale);
      setCurrentLocale(locale);
      // Optional: You might want to reload the page or use router to refresh
      // window.location.reload();
    });
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' }
  ];

  const items = [
    {
      title: t('classroom'),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t('studygroup'),
      url: "/dashboard/study-group",
      icon: Users,
      role: "student",
    },
    {
      title: t('grades'),
      url: "/dashboard/grade-report",
      icon: BarChart,
      role: "student",
    },
    {
      title: t('history'),
      url: "/dashboard/history",
      icon: History,
    },
  ];

  return (
    <Sidebar
      variant="floating"
      className="w-1/5 fixed h-screen bg-white"
      collapsible="icon"
    >
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
          <SidebarGroupLabel>{t("label")}</SidebarGroupLabel>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Languages /> {t('Language Selection')}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {languageOptions.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.value}
                    onSelect={() => handleLocaleChange(lang.value)}
                    className={`cursor-pointer ${currentLocale === lang.value ? 'bg-gray-100' : ''}`}
                  >
                    <span>{lang.label}</span>
                    {currentLocale === lang.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
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
                <span>{t('settings')}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/logout" className="flex items-center p-2 rounded-lg">
                <LogOut className="mr-3 w-5 h-5" />
                <span>{t('signout')}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
