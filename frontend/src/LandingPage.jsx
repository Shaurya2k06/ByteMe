import React from "react";
import LandingPage1 from "./components/LandingPage1";
import FeaturesComponent from "./components/FeaturesComponent";
import TimeLine from "./components/TimeLine";
import NavBar1 from "./components/NavBar1";
import Footer from "./components/footer.jsx";
import { DotBackgroundDemo } from "./components/ui/DotBackgroundDemo.jsx";

function LandingPage() {
  return (
    <div>
      <NavBar1 />
      <div className="pt-17">
        <LandingPage1 />
        <FeaturesComponent />
        <TimeLine />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;