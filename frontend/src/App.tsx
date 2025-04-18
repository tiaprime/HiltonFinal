import "./App.css";

import LandingPage from "./pages/LandingPage";
import BookingStatsPage from "./pages/BookingStatsPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EntertainerInfoPage from "./components/EntertainerInfoPage";
import AddEntertainer from "./components/AddEntertainer";

function App() {
  // NAVIGATION
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entertainerStats" element={<BookingStatsPage />} />
          <Route
            path="/entertainerInfo/:id"
            element={<EntertainerInfoPage />}
          />
          <Route path="/addEntertainer" element={<AddEntertainer />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
