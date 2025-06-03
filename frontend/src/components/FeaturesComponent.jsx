import React from "react";

function FeaturesComponent() {
  const featureBoxes = [
    {
      icon: "../public/cash.svg",
      text: "Pay Fees & much more",
    },
    {
      icon: "../public/paperclip.svg",
      text: "Peer-to-Peer Transfers",
    },
    {
      icon: "../public/bag.svg",
      text: "Exciting offers on 100+ items",
    },
    {
      icon: "../public/friends.svg",
      text: "Skip the queue for Events",
    },
  ];

  return (
    <div className="p-10">
      <h1 className="font-[500] text-[48px] leading-[100%] ">Features</h1>
      <div className="mt-10 flex items-center gap-5 hover:gap-1 duration-300 justify-evenly ">
        {featureBoxes.map((box) => {
          return (
            <div className="w-[253px]  shadow-md h-[257px] justify-center rounded-md flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300 ">
              <img
                className="w-[129px] h-[129px]  "
                src={box.icon}
                alt="icon1"
              />
              <p className=" text-[#666666] text-[20px] font-[500] leading-[100%] text-center -tracking-[-2%]">
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
