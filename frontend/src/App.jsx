import React from "react";
import { Routes, Route, BrowserRouter, Outlet } from "react-router";
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
import ScanQrPage from "./ScanPage.jsx";
import About from "./About.jsx";
import FingerprintTestPage from "./FingerprintTestPage";
import ProtectedRoutes from "./context/ProtectedRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/studentDashboard" element={<StudentDashboard />} />
            <Route path="/generate-qr" element={<QrPage />} />
            <Route path="/scan" element={<ScanQrPage />} />

            <Route path="/fingerprint" element={<FingerprintTestPage />} />

            <Route path="/shop" element={<Shop />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
