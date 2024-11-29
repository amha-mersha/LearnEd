"use client";
import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "@/lib/redux/store";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const relaxed = useSelector((state: any) => state.hamburger.value);

  return (
    // <Provider store={store}>
    //   <div className="flex relative ">
    //     <div className=" min-h-screen">
    //       {/* <Sidebar /> */}
    //     </div>
    //     <main className={relaxed ? `ml-64 pl-4 w-full` : `ml-28 w-full`}>
    //       {children}
    //     </main>
    //   </div>
    // </Provider>
    <Provider store={store}>
      <SidebarProvider >
        <AppSidebar />
        <main className= {`flex-1`}>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </Provider>
  );
}

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <main>
//         <SidebarTrigger />
//         {children}
//       </main>
//     </SidebarProvider>
//   )
// }
