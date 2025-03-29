import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Registration from "./pages/registration";
import Home from "./pages/homepage";
import Search from "./pages/search";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/search" element={<Search />} />
        <Route path="/directory" element={<div>Справочник</div>} />
      </Routes>
    </Router>
  );
}

export default App;