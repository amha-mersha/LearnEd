'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar/Sidebar"
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { useSelector } from "react-redux";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Provider store={store}>
      <html lang="en">
          <body >
            {children}
          </body>
      </html>
    </Provider>
  );
}
