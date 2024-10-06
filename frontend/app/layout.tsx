"use client";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Provider store={store}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </Provider>
  );
}
