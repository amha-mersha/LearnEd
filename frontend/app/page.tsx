"use client"
import { redirect } from "next/navigation";

export default function  Home () {
  const token = localStorage.getItem('token');

  if (token) {
    redirect(`/dashboard`);
  } else {
    redirect(`/auth/login`);
  }
}
