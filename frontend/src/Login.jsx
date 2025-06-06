import React, { useState } from "react";
import { Link } from "react-router";

function Login() {
  const [username, onUsername] = useState(false);
  const [password, onPassword] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [signedClick, setSignedClick] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-center items-center py-5 px-4 bg-white">
      <div className="w-full max-w-5xl shadow-lg flex flex-col md:flex-row p-4 bg-white rounded-lg">
        {/* Image Section */}
        <div className="w-full h-full md:w-1/2 mb-4 md:mb-0 flex justify-center items-center">
          <img
            src="/loginImage.svg"
            alt="Login"
            className="w-full max-w-sm object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-start px-2">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl md:text-3xl">
              Let's sign you in.
            </h1>
            <p className="text-gray-600 mt-4 text-base md:text-lg">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="flex mt-8 flex-col items-center" method="post">
            <div className="flex flex-col w-full max-w-[450px] mb-5">
              <label
                htmlFor="username"
                className={`font-semibold text-base md:text-lg mb-2 ${
                  username && "text-blue-500"
                }`}
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                className="w-full h-10 md:h-12 px-3 text-sm md:text-base rounded-md bg-gray-100 border border-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:rounded-lg hover:shadow"
                onFocus={() => onUsername(true)}
                onBlur={() => onUsername(false)}
              />
            </div>

            <div className="flex flex-col w-full max-w-[450px] mb-5">
              <label
                htmlFor="password"
                className={`font-semibold text-base md:text-lg mb-2 ${
                  password && "text-blue-500"
                }`}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full h-10 md:h-12 px-3 text-sm md:text-base rounded-md bg-gray-100 border border-gray-400 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:rounded-lg hover:shadow"
                onFocus={() => onPassword(true)}
                onBlur={() => onPassword(false)}
              />
            </div>

            <Link
              to="/dashboard"
              type="submit"
              className={`w-full max-w-[450px] h-12 md:h-14 text-white text-base flex justify-center items-center md:text-lg bg-blue-500 rounded-md cursor-pointer transition-transform hover:bg-blue-600 hover:shadow ${
                signedClick ? "scale-95" : ""
              }`}
              onClick={() => {
                setSignedClick(true);

                setTimeout(() => setSignedClick(false), 150);
              }}
            >
              Sign In
            </Link>

            <div className="flex items-center gap-2 my-5 w-full max-w-[450px]">
              <div className="flex-1 border-t border-gray-400"></div>
              <p className="text-gray-500 text-sm">or</p>
              <div className="flex-1 border-t border-gray-400"></div>
            </div>

            <div
              className={`w-full max-w-[450px] h-12 md:h-14 flex justify-between items-center px-4 bg-gray-100 border border-gray-400 rounded-md cursor-pointer transition-transform hover:shadow ${
                clicked ? "scale-95" : ""
              }`}
              onClick={() => {
                setClicked(true);
                setTimeout(() => setClicked(false), 150);
              }}
            >
              <p className="text-sm md:text-base">Sign up with Google</p>
              <img
                src="/googleicon.svg"
                alt="Google Icon"
                className="w-5 h-5"
              />
            </div>

            <div className="w-full max-w-[450px] mt-5 flex justify-center">
              <p className="text-center text-sm md:text-base">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
