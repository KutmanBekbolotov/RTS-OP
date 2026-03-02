import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./pages/registration";
import Home from "./pages/homepage";
import Search from "./pages/search";
import Login from "./pages/loginpage";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/registration" element={<Registration />} />
          <Route path="/search" element={<Search />} />
          <Route path="/directory" element={<div>Справочник</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
