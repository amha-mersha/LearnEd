"use client"
import { getSession, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function  Home () {
  let token = useSelector((state: any) => state.token.accessToken);
  // const { data: session } = useSession();
  // console.log("sss", session)

  if (token) {
    redirect(`/dashboard`);
  } else {
    redirect(`/auth/login`);
  }
}
