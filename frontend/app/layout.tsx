"use client";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";

import { Poppins } from 'next/font/google'

//👇 Configure our font object
const openSans = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <html lang="en" className={openSans.className}>
        <body>{children}</body>
      </html>
    </Provider>
  );
}
