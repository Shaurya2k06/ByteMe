import React from "react";
import { Link } from "react-router";

function Signup() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white px-4 py-6">
      <div className="w-full max-w-5xl shadow-lg flex flex-col md:flex-row p-5 rounded-lg bg-white">
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

        <div className="w-full md:w-1/2 p-5 flex flex-col justify-center">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 text-base outline-none transition-all duration-200 hover:shadow-md focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:shadow-lg active:scale-95"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="username" className="mb-1 text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 text-base outline-none transition-all duration-200 hover:shadow-md focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:shadow-lg active:scale-95"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 text-base outline-none mb-3 transition-all duration-200 hover:shadow-md focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:shadow-lg active:scale-95"
              />
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Re-enter your password"
                className="bg-gray-100 border border-gray-300 rounded-md px-4 py-3 text-base outline-none transition-all duration-200 hover:shadow-md focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:shadow-lg active:scale-95"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white text-lg font-medium py-3 rounded-md transition-all duration-200 hover:bg-blue-600 hover:shadow-lg focus:ring-2 focus:ring-blue-300 active:scale-95"
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
