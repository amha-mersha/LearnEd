"use client"
import { getSession, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function  Home () {
  const token = localStorage.getItem('token');

  if (token) {
    redirect(`/dashboard`);
  } else {
    redirect(`/auth/login`);
  }
}
