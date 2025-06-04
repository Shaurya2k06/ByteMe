import React from "react";

function FeaturesComponent() {
  const featureBoxes = [
    {
      icon: "/cash.svg",
      text: "Pay Fees & much more",
    },
    {
      icon: "/paperclip.svg",
      text: "Peer-to-Peer Transfers",
    },
    {
      icon: "/bag.svg",
      text: "Exciting offers on 100+ items",
    },
    {
      icon: "/friends.svg",
      text: "Skip the queue for Events",
    },
  ];

  return (
    <div className="px-5 py-10 w-full flex flex-col  " id="features">
      <h1 className="px-5 font-medium text-3xl md:text-5xl text-left">
        Features
      </h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 hover:gap-1 transition-all duration-300 w-full justify-items-center">
        {featureBoxes.map((box, index) => {
          return (
            <div
              key={index}
              className="w-[200px] sm:w-[220px] md:w-[253px] h-[230px] sm:h-[240px] md:h-[257px] shadow-md rounded-md flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform duration-300"
            >
              <img
                className="w-[100px] sm:w-[110px] md:w-[129px] h-[100px] sm:h-[110px] md:h-[129px]"
                src={box.icon}
                alt="icon"
              />
              <p className="text-[#666666] text-center text-base sm:text-lg md:text-[20px] font-medium tracking-tight px-2">
                {box.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturesComponent;
