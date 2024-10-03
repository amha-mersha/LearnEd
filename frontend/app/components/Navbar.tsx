import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Navbar = () => {
  const {data: session} =  useSession();
  return (
    <div className="h-14 w-full top-0 left-0 flex justify-end bg-white">
      {session ? (
        <Button
          className="mr-10 mt-2"
          onClick={() => signOut({ redirect: false })}
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
