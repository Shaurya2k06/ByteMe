import React from "react";
import { motion } from "framer-motion";

function TimeLineStep({ step, title, description, icon, isLast }) {
  const isEven = step % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative w-full flex justify-center"
    >
      {/* Center Dashed Line */}
      <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-blue-300 z-0" />

      {/* Step Content */}
      <div className="w-full max-w-6xl flex items-center justify-between px-4 py-12 relative z-10">
        {isEven ? (
          <>
            <div className="w-1/2 pr-8 text-right">
              <h1 className="font-semibold text-3xl">{title}</h1>
              <p className="text-lg text-gray-600 mt-2">{description}</p>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="w-[50px] h-[50px] bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-blue-500 font-bold z-10">
                {step}
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 border-l-2 border-dashed border-blue-300 mt-2" />
              )}
            </div>
            <div className="w-1/2 pl-8 flex justify-start">
              <img
                src={icon}
                alt={`Step ${step}`}
                className="w-[220px] h-[220px]"
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-1/2 pr-8 flex justify-end">
              <img
                src={icon}
                alt={`Step ${step}`}
                className="w-[220px] h-[220px]"
              />
            </div>
            <div className="relative flex flex-col items-center">
              <div className="w-[50px] h-[50px] bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-blue-500 font-bold z-10">
                {step}
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 border-l-2 border-dashed border-blue-300 mt-2" />
              )}
            </div>
            <div className="w-1/2 pl-8 text-left">
              <h1 className="font-semibold text-3xl">{title}</h1>
              <p className="text-lg text-gray-600 mt-2">{description}</p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default TimeLineStep;
