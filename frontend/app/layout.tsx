"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </Provider>
    </SessionProvider>
  );
}
