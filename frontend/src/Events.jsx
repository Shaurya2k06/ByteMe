import React, { useState, useRef, useEffect } from "react";
import NavBar3 from "./components/NavBar3";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Events() {
  const [selectedCategory, setSelectedCategory] = useState("Tech");
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const categories = ["Tech", "Cultural", "Sports", "Others"];

  const events = [
    {
      id: 1,
      icon: "/techexpo.svg",
      title: "Tech Expo",
      bits: 10,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
      date: "24-26 June 2025",
      venue: "123 Anywhere St., Any City",
    },
    {
      id: 2,
      icon: "/cybermonday.svg",
      title: "Cyber Monday",
      bits: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor",
      date: "30 June 2025",
      venue: "123 Anywhere St., Any City",
    },
  ];

  const pics = [
    {
      id: 1,
      name: "Symphony 2025",
      icon: "/symphony.svg",
    },
    {
      id: 2,
      name: "Techniez '25",
      icon: "/techniez.svg",
    },
    {
      id: 3,
      name: "Art Exhibition",
      icon: "/art.svg",
    },
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

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <NavBar3 />

      {/* Top Section */}
      <div className="flex w-full h-[250px] p-6 mt-5 items-center">
        {/* Left Text */}
        <div className="flex flex-col gap-5 py-4 w-[30%]">
          <h1 className="text-5xl font-bold">Upcoming Events</h1>
          <p className="text-xl font-semibold text-[#666666]">
            <em>Because college isn't just about classes</em>
          </p>
        </div>

        {/* Carousel */}
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
                className="min-w-full h-[300px] flex flex-col items-center  justify-center bg-center transition-all duration-300"
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

      {/* Search Bar */}
      <div className="flex mt-10 bg-white justify-center items-center h-[50px]">
        <div className="rounded-[30px] px-3 w-[50%] hover:shadow-lg transition-all hover:text-[18px] duration-300 shadow-md flex items-center">
          <input
            type="search"
            className="w-[90%] h-[50px] outline-none"
            placeholder="Search anything"
          />
          <span>
            <img src="./searchbuttonimage.svg" alt="searchbuttonimage" />
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex font-semibold w-full mt-7 justify-center items-center gap-5">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`cursor-pointer w-[160px] h-[44px] rounded-[20px] flex justify-center items-center transition-all duration-300 transform
              ${
                selectedCategory === category
                  ? "bg-[#336BFB] text-white scale-105"
                  : "bg-white text-black border border-[#336BFB]"
              }`}
          >
            {category}
          </div>
        ))}
      </div>
      <div className="flex mt-5 flex-col gap-5  items-center justify-center w-full">
        {events.map((event) => (
          <EventPosts key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventPosts({ event }) {
  return (
    <div className="w-[80%] cursor-pointer h-[200px] flex shadow-md hover:shadow-lg ">
      <div className="w-[30%] h-full">
        <img
          src={event.icon}
          alt={event.id}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="w-[70%] flex flex-col gap-2  justify-evenly px-4">
        <h3 className="text-2xl font-bold">{event.title}</h3>
        <p className="text-lg text-gray-600">{event.description}</p>
        <div className="flex justify-between ">
          <span className="text-md text-gray-500">{event.date}</span>
          <div className="bg-blue-500 px-3 py-1 rounded-[30px] text-white shadow-md hover:shadow-lg transition-all duration-300">
            Register Now
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
