import React from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import LandingPage from "./LandingPage.jsx";
import { TypewriterEffectDemo } from "./components/typewriterEffect.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import FeaturesComponent from "./components/FeaturesComponent.jsx";
import Dashboard from "./Dashboard.jsx";
import Shop from "./Shop.jsx";
import Events from "./Events.jsx";
import StudentDashboard from "./StudentDashboard.jsx";
import QrPage from "./QrPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/generate-qr" element={<QrPage />} />

        <Route path="/shop" element={<Shop />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
