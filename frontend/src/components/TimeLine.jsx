import React from "react";
import TimeLineStep from "./TimeLineStep";

function TimeLine() {
  const steps = [
    {
      step: 1,
      title: "Create Account & Connect Wallet",
      description:
        "Sign up in seconds to get your very own secure Byte wallet.",
      icon: "../public/step1.svg",
    },
    {
      step: 2,
      title: "Get your Tokens",
      description:
        "Earn or buy tokens through events, tasks, or the marketplace.",
      icon: "../public/step2.svg",
    },
    {
      step: 3,
      title: "Explore the Marketplace",
      description:
        "Use your tokens to redeem rewards, tickets, or collectibles.",
      icon: "../public/step3.svg",
    },
    {
      step: 4,
      title: "Join Events",
      description:
        "Use tokens to register for campus-wide events and unlock experiences",
      icon: "../public/step4.svg",
    },
    {
      step: 5,
      title: "Track & Manage Your Wallet",
      description: "View your balance, history, and coin flow in real time.",
      icon: "../public/step5.svg",
    },
    {
      step: 6,
      title: "Admin & Backend",
      description:
        "Organizers can track transactions, create events, and reward participants easily.",
      icon: "../public/step6.svg",
    },
  ];

  return (
    <div className="w-full p-5  ">
      <h2 className="font-[500] px-5 text-[48px] leading-[100%] mb-10 text-left ">
        How does it work?
      </h2>
      <div className="space-y-10 flex flex-col items-center w-full">
        {steps.map((item, index) => (
          <TimeLineStep
            key={item.step}
            {...item}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default TimeLine;
