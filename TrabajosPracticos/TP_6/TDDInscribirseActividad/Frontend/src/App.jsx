// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegistroView from "./views/RegistroView";
import InscripcionView from "./views/InscripcionView";
import PostInscripcionView from "./views/PostInscripcionView";

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/registro" element={<RegistroView />} />
        <Route path="/inscripcion" element={<InscripcionView />} />
        <Route path="/post-inscripcion" element={<PostInscripcionView />} />
      </Routes>
    </Router>
  );
}
