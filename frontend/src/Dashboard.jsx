import React, { useState } from "react";
import Dashboard1 from "./components/Dashboard1.jsx";
import Dashboard2 from "./components/Dashboard2.jsx";
import NavBar3 from "./components/NavBar3";
import EventPop from "./components/EventPop.jsx";

function Dashboard() {
  const [event, setEvent] = useState(false);
  return (
    <div>
      <div className="sticky top-0 z-1000">
        <NavBar3 />
      </div>
      {event && (
        <div className="fixed inset-0 bg-tranparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fadeIn">
            <EventPop event={event} setEvent={setEvent} />
          </div>
        </div>
      )}

      <Dashboard1 />
      <Dashboard2 event={event} setEvent={setEvent} />
    </div>
  );
}

export default Dashboard;
