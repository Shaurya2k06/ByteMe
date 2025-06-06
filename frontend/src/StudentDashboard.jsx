import React from "react";

const StudentDashboard = () => {
  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col p-6 gap-2 overflow-auto">
      {/* First Row: Account Balance/Total Spent, Pending Fees, Image */}
      <div className="flex flex-col sm:flex-row gap-2 h-1/3">
        {/* Part 1: Account Balance and Total Spent */}
        <div className="flex flex-col w-full sm:w-1/3 gap-2">
          {/* Account Balance */}
          <div className="bg-white p-4 rounded-lg shadow-md h-1/2">
            <h2 className="text-gray-600 text-sm">Account Balance</h2>
            <p className="text-2xl font-bold text-blue-600">
              1,000,000 <span className="text-sm">BITS</span>
            </p>
          </div>
          {/* Total Spent */}
          <div className="bg-white p-4 rounded-lg shadow-md h-1/2">
            <h2 className="text-gray-600 text-sm">Total Spent</h2>
            <p className="text-2xl font-bold text-blue-600">
              5000 <span className="text-sm">BITS</span>
            </p>
          </div>
        </div>
        {/* Part 2: Pending Fees */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full sm:w-1/3 h-full">
          <h2 className="text-gray-600 text-sm">Pending Fees</h2>
          <p className="text-2xl font-bold text-blue-600">
            20,000 <span className="text-sm">BITS</span>
          </p>
          <p className="text-gray-500 text-xs">19th Jun</p>
          <button className="mt-2 text-blue-600 text-sm">Set Up Autopay</button>
        </div>
        {/* Part 3: Image */}
        <div className="w-full sm:w-1/3 p-4  h-full flex items-center justify-center">
          <img
            src="/Student Dashboard.svg"
            alt="student"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Second Row: Calendar/Events and Send Tokens */}
      <div className="flex flex-col sm:flex-row gap-2 h-1/3">
        {/* 70% Width: Calendar and Events */}
        <div className="flex w-full sm:w-[70%] h-full">
          {/* Calendar (60%) */}
          <div className="bg-white p-4 rounded-lg shadow-md w-[60%] h-full">
            <h2 className="text-gray-600 text-sm mb-2">Calendar</h2>
            <div className="text-center">
              <p className="text-lg font-semibold">June</p>
              <div className="grid grid-cols-7 gap-1 mt-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                  <div key={idx} className="text-gray-500 text-xs">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
                  <div key={date} className="p-1 text-gray-700 text-sm">
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Vertical Line (80% height) */}
          <div className="w-px bg-gray-300 h-[80%] self-center mx-2"></div>
          {/* Events This Month (40%) */}
          <div className="bg-white p-4 rounded-lg shadow-md w-[40%] h-full">
            <h2 className="text-gray-600 text-sm mb-2">Events This Month</h2>
            <p className="font-semibold">The North Face</p>
            <p className="text-gray-500 text-sm">Epic Race</p>
            <p className="text-gray-500 text-sm">Epic Race</p>
          </div>
        </div>
        {/* 30% Width: Send Tokens (touching Image) */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full sm:w-[30%] h-full -mt-2 sm:mt-0">
          <h2 className="text-gray-600 text-sm mb-2">Send Tokens</h2>
          <div>
            <div className="mb-2">
              <label className="block text-gray-600 text-sm mb-1">
                Wallet Address
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Wallet Address"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-600 text-sm mb-1">
                No. Tokens
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                placeholder="No. Tokens"
              />
            </div>
            <button className="w-full bg-blue-600 text-white p-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Third Row: Latest Transactions */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full h-1/3">
        <h2 className="text-gray-600 text-sm mb-2">Latest Transactions</h2>
        <div className="space-y-2">
          {[
            { date: "20, 2025", to: "Osachodiv...", id: "Opklhnbv..." },
            { date: "20, 2025", to: "Osachodiv...", id: "Opklhnbv..." },
            { date: "20, 2025", to: "Osachodiv...", id: "Opklhnbv..." },
          ].map((txn, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                <p className="text-blue-600">{txn.date} BITS</p>
                <p className="text-gray-500">To: {txn.to}</p>
              </div>
              <p className="text-gray-500">{txn.id}</p>
            </div>
          ))}
        </div>
        <button className="mt-2 text-blue-600 text-sm">View more</button>
      </div>
    </div>
  );
};

export default StudentDashboard;
