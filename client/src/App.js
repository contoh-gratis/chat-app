import { React, lazy , Suspense } from "react";
import { Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import './App.css';

const Homepage = lazy(()=>import('./pages/Homepage/Homepage'))
const RoomChat = lazy(()=>import('./pages/RoomChat/RoomChat'))

const App = () => {
  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='' element={<Homepage />} />
          <Route path="/:roomId" element={<RoomChat />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
