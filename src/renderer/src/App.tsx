import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/registration";
import Home from "./pages/homepage";
import Search from "./pages/search";
import Login from "./pages/loginpage";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  const authStatus = localStorage.getItem("isAuthenticated");
  if (authStatus === "true") {
    setIsAuthenticated(true);
  }

  // 👇 Разогрев API с валидными аргументами
  try {
    if (window.electron) {
      void window.electron.checkPassword?.("init");
      void window.electron.searchVehicle?.({ type: "stateNumber", query: "__init__" });
    }
  } catch (_) {
    // не важно, упадёт или нет — главное, чтоб Proxy инициализировался
  }
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/search" element={<Search />} />
        <Route path="/directory" element={<div>Справочник</div>} />
      </Routes>
    </Router>
  );
}

export default App;
