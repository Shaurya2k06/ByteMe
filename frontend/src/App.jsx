import React from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import LandingPage from "./LandingPage.jsx";
import { TypewriterEffectDemo } from "./components/typewriterEffect.jsx";
import Login from "./Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path = '/login' element = {<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
