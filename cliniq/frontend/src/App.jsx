import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import PatientDisplay from './pages/PatientDisplay';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/receptionist" element={<ReceptionistDashboard />} />
      <Route path="/display" element={<PatientDisplay />} />
    </Routes>
  );
}
