import React from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import LandingPage from "./LandingPage.jsx";
import { TypewriterEffectDemo } from "./components/typewriterEffect.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
