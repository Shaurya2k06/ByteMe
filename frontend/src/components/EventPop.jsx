import React, { useState } from "react";
import { ChevronDown, Upload, X } from "lucide-react";
import axios from "axios";

const AddEventForm = ({ setEvent }) => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    amountToBePaid: "",
    eventLocation: "",
    eventDescription: "",
    tags: "",
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const eventTypes = ["Tech Event", "Sports Event", "Cultural Event"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEventTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      tags: type,
    }));
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        "http://localhost:9092/events/createEvent",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      setSuccess("Event created successfully!");
      setTimeout(() => {
        setShowForm(false);
        setEvent(false);
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create event. Please try again."
      );
    }
  };

  if (!showForm) return null;

  return (
    <div className="flex items-center w-full h-screen justify-center p-2 sm:p-4">
      <div className="bg-white w-[60%] h-[90%] rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-medium">
                📅
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Add New Event
            </h2>
          </div>
          <button
            onClick={() => {
              setShowForm(false);
              setEvent(false);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} className="sm:w-5 cursor-pointer sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm mb-2">{success}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                placeholder="Whatever"
                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Date of Event
              </label>
              <input
                type="text"
                value={formData.eventDate}
                onChange={(e) =>
                  handleInputChange("eventDate", e.target.value)
                }
                placeholder="10/10/2025"
                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Registration Fees
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.amountToBePaid}
                  onChange={(e) =>
                    handleInputChange("amountToBePaid", e.target.value)
                  }
                  placeholder="100.25"
                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 sm:pr-12"
                />
                <span className="absolute right-2 sm:right-3 top-2 text-blue-500 text-xs sm:text-sm font-medium">
                  BTS
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.eventLocation}
                onChange={(e) => handleInputChange("eventLocation", e.target.value)}
                placeholder="Enter Location"
                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.eventDescription}
              onChange={(e) => handleInputChange("eventDescription", e.target.value)}
              placeholder="Introducing xyz!...."
              rows={3}
              className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Add Poster
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload
                  size={14}
                  className="mx-auto text-gray-400 mb-1 sm:w-4 sm:h-4"
                />
                <span className="text-xs sm:text-sm text-gray-500">
                  Upload file
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Type of Event
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
                >
                  <span
                    className={
                      formData.tags ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {formData.tags || "Select an option"}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 sm:w-4 sm:h-4"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {eventTypes.map((type, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEventTypeSelect(type)}
                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-md last:rounded-b-md"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add Event Button */}
          <div
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-600 text-white text-center py-2 sm:py-3 rounded-md font-semibold cursor-pointer hover:bg-blue-700 transition duration-200"
          >
            Add Event
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventForm;