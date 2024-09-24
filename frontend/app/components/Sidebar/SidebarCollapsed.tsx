import Image from "next/image";
import React from "react";
import hamburger from "../../../public/Images/solar_hamburger-menu-broken.svg";
import classroom from "../../../public/Images/mdi_google-classroom.svg";
import history from "../../../public/Images/history.svg";
import setting from "../../../public/Images/uil_setting.svg";
import logout from "../../../public/Images/logout.svg";
import { useDispatch } from "react-redux";
import { relax } from "@/lib/redux/slices/sidebarSlice";

const SidebarCollapsed = () => {
  const dispatch = useDispatch();

  return (
    <div className=" w-1/12 bg-red-100 bottom-0 top-0 absolute ">
      <div className="flex mt-6 cursor-pointer  justify-center ">
        <Image
          className="border w-6 h-6 mr-2 mt-2 flex justify-center"
          onClick={() => dispatch(relax())}
          src={hamburger}
          alt=""
        ></Image>
      </div>

      <div className=" flex mt-36 flex-col items-center space-y-4">
        <div className="flex space-x-3">
          <Image className="w-6" src={classroom} alt="class"></Image>
        </div>

        <div className="flex space-x-3">
          <Image className="w-7" src={history} alt=""></Image>
        </div>
      </div>

      <div className=" flex bottom-8 left-10 absolute items-center flex-col space-y-4">
        <div className="flex space-x-3">
          <Image className="w-7" src={setting} alt=""></Image>
        </div>

        <div className="flex space-x-3">
          <Image className="w-7" src={logout} alt=""></Image>
        </div>
      </div>
    </div>
  );
};

export default SidebarCollapsed;
