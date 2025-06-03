import React, { useState } from "react";
import { Link } from "react-router";

function Login() {
  const [username, onUsername] = useState(false);
  const [password, onPassword] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [signedClick, setSignedClick] = useState(false);

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
            <p className="text-[#666666] mt-5 font-[500] text-[24px] leading-[100%]">
              Welcome back! please enter your details{" "}
            </p>
          </div>
          <form className="flex mt-10 flex-col">
            <div className="gap-2 flex flex-col mb-10">
              <label
                for="username"
                className={`font-semibold text-[25px] leading-[100%] ${
                  username && "text-[30px] text-blue-500"
                }`}
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                className=" focus:rounded-lg hover:rounded-lg focus:ring-2 hover:shadow-lg focus:ring-blue-500  transition-transform duration-300 w-[524px] h-[60px] text-[24px] rounded-md outline-none bg-[#0000000D] border-1 border-[#666666]"
                onClick={() => onUsername(true)}
                onBlur={() => onUsername(false)}
              />
            </div>
            <div className="gap-2 flex flex-col mb-10">
              <label
                for="password"
                className={`font-semibold text-[25px] leading-[100%] ${
                  password &&
                  "text-[30px] text-blue-500 transition-transform ease-out duration-300"
                }`}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="  w-[524px] h-[60px] text-[24px] hover:shadow-lg outline-none bg-[#0000000D] border-1 border-[#666666] rounded-md hover:rounded-lg ease-in-out focus:rounded-lg focus:ring-2 focus:ring-blue-500 transition-transform duration-400"
                onClick={() => onPassword(true)}
                onBlur={() => onPassword(false)}
              />
            </div>
            <input
              type="submit"
              value="Sign In"
              className={`w-[524px] h-[70px] text-[24px] cursor-pointer hover:shadow-lg hover:bg-blue-700   transition-transform ease-in-out duration-300 text-center bg-blue-500 text-white rounded-md ${
                signedClick ? "scale-95" : ""
              }`}
              onClick={() => {
                setSignedClick(true);
                setTimeout(() => setClicked(false), 150);
              }}
            />

            <div className="flex gap-2 mt-5 items-center">
              <div className="w-[236.5px] h-0 border-1 border-[#666666]"></div>
              <p>or</p>
              <div className="w-[236.5px] h-0 border-1 border-[#666666]"></div>
            </div>
            <div
              className={`cursor-pointer hover:shadow-lg px-5 w-[524px] h-[70px]  text-[24px] flex justify-between items-center mt-5 bg-[#0000000D] border-1 border-[#666666] rounded-md ${
                clicked ? "scale-95" : ""
              }`}
              onClick={() => {
                setClicked(true);
                setTimeout(() => setClicked(false), 150);
              }}
            >
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
