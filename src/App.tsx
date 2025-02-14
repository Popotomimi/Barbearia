// React router dom
import { BrowserRouter, Routes, Route } from "react-router-dom";

// React-Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Schedule from "./components/Schedule";

// Pages
import Admin from "./components/pages/Admin";

function App() {
  const api: string = "https://backendbarbearia-6205.onrender.com/api";

  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer autoClose={3000} position="top-center" />
      <Routes>
        <Route path="/" element={<Schedule api={api} />} />
        <Route path="/admin" element={<Admin api={api} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
