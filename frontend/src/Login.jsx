import React from "react";
import { Link } from "react-router";

function Login() {
  return (
    <div className="w-full h-full flex justify-center items-center py-5">
      <div className="w-[90%] h-[90%] shadow-lg flex">
        <div className="w-1/2">
          <img src="../public/loginImage.svg" alt="Login image" />
        </div>
        <div className="w-1/2 flex flex-col justify-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-[700] text-[48px] leading-[100%]">
              Let's sign you in.
            </h1>
            <p className="text-[#666666] font-[500] text-[24px] leading-[100%]">
              Welcome back! please enter your details{" "}
            </p>
          </div>
          <form className="flex mt-5 flex-col">
            <div className="gap-2 flex flex-col mb-10">
              <label
                for="username"
                className="font-[400] text-[30px] leading-[100%]"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                className=" w-[524px] h-[70px] text-[24px] rounded-md outline-none bg-[#0000000D] border-1 border-[#666666]"
              />
            </div>
            <div className="gap-2 flex flex-col mb-10">
              <label
                for="password"
                className="font-[400] text-[30px] leading-[100%]"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="  w-[524px] h-[70px] text-[24px] outline-none bg-[#0000000D] border-1 border-[#666666] rounded-md"
              />
            </div>
            <input
              type="submit"
              value="Sign In"
              className="w-[524px] h-[70px] text-[24px]  text-center bg-blue-500 text-white rounded-md"
            />

            <div className="flex gap-2 mt-5 items-center">
              <div className="w-[236.5px] h-0 border-1 border-[#666666]"></div>
              <p>or</p>
              <div className="w-[236.5px] h-0 border-1 border-[#666666]"></div>
            </div>
            <div className="px-5 w-[524px] h-[70px]  text-[24px] flex justify-between items-center mt-5 bg-[#0000000D] border-1 border-[#666666] rounded-md">
              <p>Sign up with Google</p>
              <img
                src="../public/googleicon.svg"
                alt="Google Icon"
                className="w-6 h-6"
              />
            </div>
            <div className="w-[524px] h-[70px] flex justify-center items-center">
              <p className="font-[400px] text-[24px] leading-[100%] text-center">
                Don't have an account?{" "}
                <span>
                  <Link to="#" className="text-blue-500">
                    Sign Up
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
