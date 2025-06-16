import React from "react";

function OfferCard({ offer }) {
  // Map named color 'cyan' to its hex equivalent, ensure hex colors start with #
  const shadowColor =
    offer.color === "cyan"
      ? "#06B6D4"
      : offer.color.startsWith("#")
      ? offer.color
      : `#${offer.color}`;

  // Define box-shadow styles for normal and hover states
  const boxShadow = `0 4px 6px 2px ${shadowColor}80`;
  const hoverBoxShadow = `0 10px 15px -2px ${shadowColor}99`;

  return (
    <div
      className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl rounded-3xl flex items-center bg-white/90 backdrop-blur-md hover:scale-95 transition-all duration-200 gap-4 sm:gap-5 p-4 sm:p-5"
      style={{ boxShadow }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = hoverBoxShadow)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = boxShadow)}
    >
      <div className="w-[40%] h-full flex justify-center items-center p-3">
        <img
          src={offer.icon}
          alt={offer.title}
          className="w-full h-auto max-h-16 sm:max-h-20 object-contain"
        />
      </div>
      <div className="w-[60%] h-full flex flex-col justify-center items-start gap-2 sm:gap-3 p-2">
        <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl text-gray-800">
          {offer.title}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
          {offer.description}
        </p>
      </div>
    </div>
  );
}

export default OfferCard;
