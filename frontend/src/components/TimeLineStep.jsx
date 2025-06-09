import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function TimeLineStep({ step, title, description, icon, isLast }) {
  const isEven = step % 2 === 0;

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="relative w-full flex justify-center">
      {/* Timeline Line */}
      <div 
        className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 border-l-2 border-dashed border-blue-300 z-0"
        data-aos="fade-up"
        data-aos-delay="200"
      />

      <div className="w-full max-w-6xl flex items-center justify-between px-4 py-12 relative z-10">
        {isEven ? (
          <>
            {/* Text Content - Right Side */}
            <div 
              className="w-1/2 pr-8 text-right"
              data-aos="fade-right"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              <h1 
                className="font-semibold text-3xl text-gray-800 mb-3"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                {title}
              </h1>
              <p 
                className="text-lg text-gray-600 leading-relaxed"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                {description}
              </p>
            </div>

            {/* Center Circle */}
            <div className="relative flex flex-col items-center">
              <div 
                className="w-[60px] h-[60px] bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-white rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl z-10 hover:scale-110 transition-transform duration-300"
                data-aos="zoom-in"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                {step}
              </div>
              {!isLast && (
                <div 
                  className="w-0.5 flex-1 border-l-2 border-dashed border-blue-300 mt-2"
                  data-aos="fade-up"
                  data-aos-delay="700"
                />
              )}
            </div>

            {/* Image - Left Side */}
            <div 
              className="w-1/2 pl-8 flex justify-start"
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="1000"
            >
              <div 
                className="relative group"
                data-aos="zoom-in-left"
                data-aos-delay="500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img
                  src={icon}
                  alt={`Step ${step}`}
                  className="relative w-[220px] h-[220px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Image - Right Side */}
            <div 
              className="w-1/2 pr-8 flex justify-end"
              data-aos="fade-right"
              data-aos-delay="400"
              data-aos-duration="1000"
            >
              <div 
                className="relative group"
                data-aos="zoom-in-right"
                data-aos-delay="500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img
                  src={icon}
                  alt={`Step ${step}`}
                  className="relative w-[220px] h-[220px] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-lg"
                />
              </div>
            </div>

            {/* Center Circle */}
            <div className="relative flex flex-col items-center">
              <div 
                className="w-[60px] h-[60px] bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-white rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl z-10 hover:scale-110 transition-transform duration-300"
                data-aos="zoom-in"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                {step}
              </div>
              {!isLast && (
                <div 
                  className="w-0.5 flex-1 border-l-2 border-dashed border-blue-300 mt-2"
                  data-aos="fade-up"
                  data-aos-delay="700"
                />
              )}
            </div>

            {/* Text Content - Left Side */}
            <div 
              className="w-1/2 pl-8 text-left"
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="1000"
            >
              <h1 
                className="font-semibold text-3xl text-gray-800 mb-3"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                {title}
              </h1>
              <p 
                className="text-lg text-gray-600 leading-relaxed"
                data-aos="fade-left"
                data-aos-delay="500"
              >
                {description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Floating Elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-60"
        data-aos="fade-up"
        data-aos-delay="800"
        data-aos-duration="1500"
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-50"
        data-aos="fade-down"
        data-aos-delay="900"
        data-aos-duration="1500"
      ></div>
    </div>
  );
}

export default TimeLineStep;