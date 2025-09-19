import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FindRoutes from './components/FindRoutes';
import Contact from './components/Contact';
import Fares from './components/Fares';
import '../src/main';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<FindRoutes />} />
        <Route path="/fares" element={<Fares />} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
