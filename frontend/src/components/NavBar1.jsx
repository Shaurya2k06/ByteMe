import React from "react";
import { Link } from "react-router";

function NavBar1() {
  return (
    <div className=" flex justify-between">
      <div className="flex">
        <img
          className="w-[73px] h-[65px] "
          src="../public/navbarLogo.svg"
          alt="logo"
        />
        <h1 className="inline-block font-[700] text-[64px] leading-[100%] text-[#336BFB]">
          ByteMe
        </h1>
      </div>
      <div className=" flex   mr-2 items-center justify-center gap-10">
        <Link to="/" className="font-[500] text-[28px] leading-[100%] ">
          Home
        </Link>
        <Link to="/" className="font-[500] text-[28px] leading-[100%] ">
          Features
        </Link>
        <Link to="/" className="font-[500] text-[28px] leading-[100%] ">
          Support
        </Link>
        <Link
          to="/"
          className="font-[500]  bg-blue-500 text-white rounded-[15px] text-[28px] p-2 leading-[100%] "
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default NavBar1;
