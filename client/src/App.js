import React from "react";
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import RoomChat from './pages/RoomChat/RoomChat';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='' element={<Homepage />} />
        <Route path="/:room_id" element={<RoomChat />} />
      </Routes>
    </div>
  );
}

export default App;
