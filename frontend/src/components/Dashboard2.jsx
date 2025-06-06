import React from "react";
import { ChevronRight, Users } from "lucide-react";

// Student List Component
const StudentList = () => {
  const students = [
    { username: "whatever@03", key: "0xsdnwhisd...", status: "paid" },
    { username: "whatever@03", key: "0xsdnwhisd...", status: "unpaid" },
    { username: "whatever@03", key: "0xsdnwhisd...", status: "paid" },
    { username: "whatever@03", key: "0xsdnwhisd...", status: "paid" },
    { username: "whatever@03", key: "0xsdnwhisd...", status: "paid" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">List of Students</span>
        </div>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
          view more
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700 text-center">
          username
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">key</div>
        <div className="text-sm font-medium text-gray-700 text-center">
          status
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {students.map((student, index) => (
          <div
            key={index}
            className="grid grid-cols-3 px-4 py-3 hover:bg-gray-50"
          >
            <div className="text-2xl text-gray-900 font-bold text-center">
              {student.username}
            </div>
            <div className="text-2xl text-gray-600 font-mono text-center">
              {student.key}
            </div>
            <div className="text-center">
              <span
                className={`inline-flex items-center px-8 py-2 rounded-full text-xl font-medium w-full max-w-32 justify-center ${
                  student.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {student.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add New Event Component
const AddNewEvent = ({ setEvent }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-3">
        <img
          src="/calendar.svg"
          alt="calendar logo"
          className="w-[49px] h-[49px]"
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Event
        </h3>
      </div>

      <button
        className="cursor-pointer w-full mt-8 bg-blue-600 text-white rounded-full h-12 flex items-center justify-center hover:bg-blue-700 transition-colors"
        onClick={() => setEvent(true)}
      >
        <span className="text-xl font-bold">+</span>
      </button>
    </div>
  );
};

// Image Component
const ImagePlaceholder = () => {
  return (
    <div className="px-3 py-3 flex items-center justify-center h-96">
      <div className="text-center text-gray-500">
        <img
          src="/dashboard2image.svg"
          alt="image2"
          className="w-[371px] h-[346px]"
        />
      </div>
    </div>
  );
};

// Transactions Table Component
const Transactions = () => {
  const tableData = [
    ["Cell 1A", "Cell 1B", "Cell 1C", "Cell 1D"],
    ["Cell 2A", "Cell 2B", "Cell 2C", "Cell 2D"],
    ["Cell 3A", "Cell 3B", "Cell 3C", "Cell 3D"],
    ["Cell 4A", "Cell 4B", "Cell 4C", "Cell 4D"],
    ["Cell 5A", "Cell 5B", "Cell 5C", "Cell 5D"],
  ];

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 px-3 py-3 mt-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          Full Width Table
        </h3>
      </div>

      <div className="grid grid-cols-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700 text-center">
          Column A
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
          Column B
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
          Column C
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
          Column D
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {tableData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-4 px-4 py-3 hover:bg-gray-50"
          >
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="text-center text-gray-700 font-medium text-base"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Layout
const Dashboard2 = ({ event, setEvent }) => {
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col gap-5 p-5">
      {/* First Div - Responsive Row/Column */}
      <div className="flex flex-col md:flex-row gap-5 flex-1">
        {/* Left Div */}
        <div className="md:w-[40%] flex flex-col gap-2.5">
          <AddNewEvent setEvent={setEvent} />
          <ImagePlaceholder />
        </div>

        {/* Right Div */}
        <div className="md:w-[60%]">
          <StudentList />
        </div>
      </div>

      {/* Second Div */}
      <Transactions />
    </div>
  );
};

export default Dashboard2;