import React from "react";
import { Link } from "react-router";

function Signup() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-5xl shadow-lg flex flex-col md:flex-row p-5 rounded-lg bg-white">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-5">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600 mb-5">
            Your digital campus journey starts here!
          </p>
          <img
            src="/registerimage.svg"
            alt="Signup Illustration"
            className="w-full max-w-md object-contain"
          />
          <p className="mt-4 text-lg">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-center">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 outline-none mb-3"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium py-3 rounded-md transition duration-300"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
