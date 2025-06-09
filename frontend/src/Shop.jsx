import React from "react";
import { Search } from "lucide-react";
import NavBar3 from "./components/NavBar3";
import { useState, useEffect } from "react";
import axios from "axios";

// Card Component
const ShopCard = ({data}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="relative w-full h-40 bg-gray-200 flex items-center justify-center">
        {/* Image Placeholder */}
        <span className="text-gray-500 text-sm">Image Placeholder</span>

        {/* Bestseller Tag */}
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
          bestseller
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-bold text-base text-black">
          {data?.itemName || "Red Sauce Pasta"}
        </h3>
        <p className="text-xs text-gray-500 leading-snug">
          {data?.itemDescription || "Experience Italy’s classic tangy & cheesy flavor in every bite."}
        </p>
        <div className="flex justify-between items-center mt-2">
  <span className="text-[#5264FF] font-bold text-sm">
    {data?.itemPrice ? `${data.itemPrice} BITS` : "10 BITS"}
  </span>
          <button className="bg-[#5264FF] text-white text-sm px-4 py-1 rounded-full hover:bg-blue-700 transition">
            get now!
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Shop Page Component
const ShopPage = () => {
  const cards = new Array(9).fill(0); // 9 placeholder cards
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {

    const fetchAllItems = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const res = await axios.get("https://byteme-ue8b.onrender.com/shop/getItems", {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true, // optional, include if backend expects cookies
        });
        setResults(res.data.items || res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        axios
            .get(`https://byteme-ue8b.onrender.com/shop/search?query=${encodeURIComponent(query)}`)
            .then((res) => {
              setResults(res.data); // assuming this returns array of cards
            })
            .catch((err) => {
              console.error("Search error:", err);
            });
      } else {
        fetchAllItems();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);
  return (
    <div className="w-full min-h-screen bg-white">
      <NavBar3 />

      {/* Content Wrapper */}
      <div className="px-6 py-10 flex flex-col gap-10">
        {/* New flex parent wrapping two divs */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
          {/* Left div: header + search */}
          <div className="flex flex-col justify-center items-start gap-6 w-full lg:w-[60%]">
            <div className="w-full">
              <h1 className="text-5xl font-extrabold text-black">
                Your One-Stop Student Shop!
              </h1>
              <p className="text-gray-500 mt-2">
                Your digital wallet just became your favorite shopping tool.
              </p>
            </div>

            {/* Search Bar */}
            <div
                className="flex items-center max-w-md w-full bg-gray-100 rounded-full px-4 py-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400">
              <Search className="text-gray-500 w-5 h-5"/>
              <input
                  type="text"
                  placeholder="Search anything..."
                  className="flex-1 bg-transparent outline-none px-2 text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right div: image */}
          <div className="flex justify-center items-center w-full lg:w-[40%]">
            <img src="/shopimage.svg" alt="Illustration"/>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {
            results.length > 0
              ? results.map((item, idx) => (
                  <ShopCard key={idx} data={item} />
              ))
              : cards.map((_, idx) => <ShopCard key={idx} />
                )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
