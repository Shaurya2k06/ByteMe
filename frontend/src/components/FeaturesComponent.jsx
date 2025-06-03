import React from "react";

function FeaturesComponent() {
  const featureBoxes = [
    {
      icon: "Cash",
      text: "Pay Fees & much more",
    },
    {
      icon: "Paperclip",
      text: "Peer-to-Peer Transfers",
    },
    {
      icon: "bag",
      text: "Exciting offers on 100+ items",
    },
    {
      icon: "Friends",
      text: "Skip the queue for Events",
    },
  ];

  return (
    <div className="p-10">
      <h1 className="font-[500] text-[48px] leading-[100%] ">Features</h1>
      <div className="mt-10 flex items-center gap-5 justify-evenly ">
        {featureBoxes.map((box) => {
          return (
            <div className="w-[253px]  shadow-md h-[257px] justify-center rounded-md flex flex-col ">
              <img src="" alt={box.icon} />
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
