import React from "react";
import Dashboard1 from "./components/Dashboard1.jsx";
import Dashboard2 from "./components/Dashboard2.jsx";
import NavBar1 from "./components/NavBar1";

function Dashboard() {
  return (
    <div>
      <div className="sticky top-0 z-10">
        <NavBar1 />
      </div>
      <Dashboard1 />
      <Dashboard2 />
    </div>
  );
}

export default Dashboard;
