import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Cookie from "js-cookie";

const Navbar = () => {
  // const token = localStorage.getItem("token")
  const token = Cookie.get('token');
  return (
    <div className="h-14 w-full top-0 left-0 flex justify-end bg-white">
      {token ? (
        <Button
          className="mr-10 mt-2"
          onClick={() => {
            // localStorage.setItem("token", "");
            // localStorage.setItem("role", "");
            Cookie.remove("token");
            Cookie.remove("role");
          }}
        >
          Log out
        </Button>
      ) : (
        <Link href={`/auth/login`}>
          <Button className="mr-10 mt-2">Login</Button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
