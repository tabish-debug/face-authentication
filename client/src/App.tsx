import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/login';
import Register from './views/register';
import Success from './views/success';
import Cookies from 'js-cookie';
import { Service } from './services/service';

function App() {
  const [logging, setLogging] = useState(Cookies.get('logged_in') === 'True');

  useEffect(() => {
    async function refreshLogging() {
      const service = new Service();
      const response: any = await service.refreshAccessToken();
      setLogging(response.status === 200);
    }

    if (!logging) {
      refreshLogging();
    }
  }, []);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Routes>
        <Route path="/register" element={!logging ? <Register /> : <Navigate to="/" />} />
        <Route
          path="/login"
          element={!logging ? <Login setLogging={setLogging} /> : <Navigate to="/" />}
        />
        {
          <Route
            path="/"
            element={logging ? <Success setLogging={setLogging} /> : <Navigate to="/login" />}
          />
        }
        {}
      </Routes>
    </div>
  );
}

export default App;
