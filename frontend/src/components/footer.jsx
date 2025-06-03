import React from "react";
import { Link } from "react-router";

function Footer() {
  return (
    <div className="bg-[#666666] w-full h-auto px-5 flex flex-col items-center">
      <div className="w-full flex px-5">
        <div className="w-1/2 flex-col items-start gap-5">
          <div className="flex items-center">
            <img
              src="../public/navbarLogo.svg"
              alt="logo"
              className="w-[75px] h-[88px]"
            />
            <h1 className="font-[700] text-[50px] leading-[100%] text-white">
              ByteMe
            </h1>
          </div>
          <div className="flex flex-col text-white gap-3">
            <p className="font-[700] text-[32px] leading-[100%]">Contact Us</p>
            <p>+91XXXXXXXX</p>
            <p>support@name.com</p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col mt-5 px-5 items-end gap-5">
          <Link className="font-[700] text-white" to="#">
            Home
          </Link>
          <Link className="font-[700] text-white" to="#">
            Login
          </Link>
          <Link className="font-[700] text-white" to="#">
            Events
          </Link>
          <Link className="font-[700] text-white" to="#">
            Marketplace
          </Link>
        </div>
      </div>
      <p className="text-white text-center mt-5 font-[500] text-[18px]">
        <em>
          Name is your campus's digital wallet and event hub: earn, spend, and
          explore with tokens built for student life.
        </em>
      </p>
    </div>
  );
}

export default Footer;
