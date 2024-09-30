"use client"
import React from 'react'
import { Provider, useSelector } from 'react-redux';
import { store } from '@/lib/redux/store'; 
import Sidebar from '../components/Sidebar/Sidebar';


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const relaxed = useSelector((state:any) => state.hamburger.value)

    return (
    <Provider store={store}>
        <html lang="en">
            <body className="flex relative">
              <div className=' min-h-screen'>
                <Sidebar />
              </div>
              <main className={relaxed ? `ml-64 pl-4 w-full` : `ml-28 w-full`}>
                {children}
              </main>
            </body>
        </html>
    </Provider>
    );
  }