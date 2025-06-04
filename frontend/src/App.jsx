import React from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import LandingPage from "./LandingPage.jsx";
import { TypewriterEffectDemo } from "./components/typewriterEffect.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import FeaturesComponent from "./components/FeaturesComponent.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
