"use client"
import { redirect } from "next/navigation";
import Cookie from "js-cookie";

export default function  Home () {
  // const token = localStorage.getItem('token');
  const token = Cookie.get('token');

  if (token) {
    redirect(`/dashboard`);
  } else {
    redirect(`/auth/login`);
  }
}
