import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './views/login';
import Register from './views/register';
import Success from './views/success';

function App() {
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;
