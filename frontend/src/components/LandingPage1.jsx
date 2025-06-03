import React from "react";
import NavBar1 from "./NavBar1";

function LandingPage1() {
  return (
    <div className="flex w-full min-h-screen flex-col jusftify-center">
      <NavBar1 />
      <div className="flex-1 flex-col bg-blue-500">
        <div className="flex- flex-1 w-full bg-red-500">
          <div className="flex-1"></div>
          <div className="flex-1 object-fit">
            <img src="../public/HeroImage.svg" alt="Hero image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage1;
