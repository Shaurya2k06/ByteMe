import React, { useState, useRef, useEffect } from "react";
import NavBar3 from "./components/NavBar3";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const carouselRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["All", "Tech", "Cultural", "Sports", "Others"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:9092/events/getAllEvents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });

        const mappedEvents = response.data.map((event) => ({
          id: event._id,
          icon: event.eventImageUrl || "https://source.unsplash.com/random/400x300?event",
          title: event.eventName,
          bits: event.amountToBePaid,
          description: event.eventDescription,
          date: new Date(event.eventDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          tags: event.tags,
          venue: event.eventLocation,
        }));

        setEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, []);

  const pics = [
    { id: 1, name: "Symphony 2025", icon: "/symphony.svg" },
    { id: 2, name: "Techniez '25", icon: "/techniez.svg" },
    { id: 3, name: "Art Exhibition", icon: "/art.svg" },
  ];

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    if (container && container.children[index]) {
      const scrollLeft = container.children[index].offsetLeft;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % pics.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + pics.length) % pics.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex]);

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
        selectedCategory === "All" ||
        (event.tags &&
            event.tags.some((tag) =>
                tag.toLowerCase().includes(selectedCategory.toLowerCase())
            ));

    const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
      <div className="w-screen min-h-screen flex flex-col">
        <NavBar3 />

        <div className="flex w-full h-[250px] p-6 mt-5 items-center">
          <div className="flex flex-col gap-5 py-4 w-[30%]">
            <h1 className="text-5xl font-bold">Upcoming Events</h1>
            <p className="text-xl font-semibold text-[#666666]">
              <em>Because college isn't just about classes</em>
            </p>
          </div>

          <div className="relative w-[70%] flex items-center justify-center overflow-hidden">
            <button
                onClick={handlePrev}
                className="absolute left-0 z-10 bg-white border rounded-full shadow-md p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={28} />
            </button>

            <div
                ref={carouselRef}
                className="flex w-full overflow-hidden scroll-smooth no-scrollbar"
            >
              {pics.map((pic) => (
                  <div
                      key={pic.id}
                      className="min-w-full h-[300px] flex flex-col items-center justify-center bg-center transition-all duration-300"
                  >
                    <img
                        src={pic.icon}
                        alt={pic.name}
                        className="w-full h-[300px] object-cover rounded-[25px] shadow-md"
                    />
                    <span className="mt-2 font-medium">{pic.name}</span>
                  </div>
              ))}
            </div>

            <button
                onClick={handleNext}
                className="absolute right-0 z-10 bg-white border rounded-full shadow-md p-2 hover:bg-gray-100"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        <div className="flex mt-10 bg-white justify-center items-center h-[50px]">
          <div
              className="rounded-[30px] px-3 w-[50%] hover:shadow-lg transition-all hover:text-[18px] duration-300 shadow-md flex items-center">
            <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[90%] h-[50px] outline-none"
                placeholder="Search anything"
            />
            <span>
            <img src="./searchbuttonimage.svg" alt="searchbuttonimage"/>
          </span>
          </div>
        </div>

        <div className="flex font-semibold w-full mt-7 justify-center items-center gap-5">
          {categories.map((category) => (
              <div
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer w-[160px] h-[44px] rounded-[20px] flex justify-center items-center transition-all duration-300 transform
              ${selectedCategory === category
                      ? "bg-[#336BFB] text-white scale-105"
                      : "bg-white text-black border border-[#336BFB]"}`}
              >
                {category}
              </div>
          ))}
        </div>

        <div className="flex mt-5 flex-col gap-5 items-center justify-center w-full">
          {filteredEvents.map((event) => (
              <EventPosts key={event.id} event={event} />
          ))}
        </div>
      </div>
  );
}

function EventPosts({ event }) {
  const handleRegister = async () => {
    try {
      const response = await axios.post(
          "http://localhost:9092/events/joinEvent",
          { eventId: event.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
      );
      toast.success("Successfully registered for event!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
          error.response?.data?.message || "Failed to register for the event"
      );
    }
  };

  return (
      <div className="w-[80%] h-[220px] flex rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white">
        <div className="w-[30%] h-full">
          <img
              src={event.icon}
              alt={event.id}
              className="w-full h-full object-cover"
          />
        </div>

        <div className="w-[70%] flex flex-col justify-between px-4 py-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{event.date}</span>
            <span className="text-sm text-gray-600">{event.bits} BITS</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Venue:</span> {event.venue}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Tags:</span> {event.tags}
            </p>
          </div>

          <div className="flex justify-end">
            <button
                onClick={() => handleRegister(event.id)}
                className="bg-blue-500 px-4 py-1 rounded-full text-white text-sm font-medium shadow hover:shadow-md transition-all duration-300"
            >
              Register Now
            </button>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000}/>
      </div>
  );
}

export default Events;