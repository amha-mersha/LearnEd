import React, { useEffect, useState } from "react";
const logo = require("../../../public/Images/LearnEd.svg");
const classroom = require("../../../public/Images/mdi_google-classroom.svg");
const history = require("../../../public/Images/history.svg");
const setting = require("../../../public/Images/uil_setting.svg");
const hamburger = require("../../../public/Images/solar_hamburger-menu-broken.svg");
const logout = require("../../../public/Images/logout.svg");
const studyperson = require("../../../public/Images/fluent_people-16-regular.svg");
const gradereport = require("../../../public/Images/carbon_report.svg");
import Cookie from "js-cookie";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { collapse } from "@/lib/redux/slices/sidebarSlice";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SidebarRelaxed = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch the role from localStorage
    // const userRole = localStorage.getItem("role");
    const userRole = Cookie.get("role");

    setRole(userRole);
  }, []);

  return (
    <div className="w-1/5 bg-white left-0 h-screen top-0 fixed">
      <div className="flex cursor-pointer justify-start pl-10 pt-2">
        <Image
          className="border w-6 h-6 mr-2 mt-6 flex"
          onClick={() => dispatch(collapse())}
          src={hamburger}
          alt=""
        ></Image>
      </div>

      <div className="flex h-28 justify-center mt-1">
        <Image src={logo} className="w-32 py-4" alt="logo"></Image>
      </div>

      <div className="flex flex-col ml-16 space-y-4">
        <Link href="/dashboard">
          <div
            className={`${
              pathname === "/dashboard" ? "bg-[#e2dbdb]" : ""
            } flex p-2 rounded-xl mr-6 space-x-3`}
          >
            <Image className="w-6" src={classroom} alt="class"></Image>
            <h1 className="font-semibold">Class Rooms</h1>
          </div>
        </Link>

        {/* Conditionally render for teacher role */}
        {role === "student" && (
          <>
            <Link href="/dashboard/study-group">
              <div
                className={`${
                  pathname === "/dashboard/study-group" ? "bg-[#e2dbdb]" : ""
                } flex p-2 rounded-xl mr-6 space-x-3`}
              >
                <Image className="w-6" src={studyperson} alt=""></Image>
                <h1 className="font-semibold">Study Group</h1>
              </div>
            </Link>
            <Link href="/dashboard/grade-report">
              <div
                className={`${
                  pathname === "/dashboard/grade-report" ? "bg-[#e2dbdb]" : ""
                } flex p-2 rounded-xl mr-6 space-x-3`}
              >
                <Image className="w-6" src={gradereport} alt=""></Image>
                <h1 className="font-semibold">Grade Report</h1>
              </div>
            </Link>
          </>
        )}

        <div className="flex space-x-3">
          <Image className="w-7" src={history} alt=""></Image>
          <h1 className="font-semibold">History</h1>
        </div>
      </div>

      <div className="flex mt-64 flex-col ml-16 space-y-4">
        <div className="flex space-x-3">
          <Image className="w-7" src={setting} alt=""></Image>
          <h1 className="font-semibold">Setting</h1>
        </div>

        <div className="flex space-x-3">
          <Image className="w-7" src={logout} alt=""></Image>
          <h1 className="font-semibold">Sign Out</h1>
        </div>
      </div>
    </div>
  );
};

export default SidebarRelaxed;
