import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const correctPassword = "123"; 

  const handleLogin = () => {
    if (password === correctPassword) {

      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      navigate("/"); 
    } else {
      setError("Неверный пароль");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Введите пароль для входа
      </Typography>
      <TextField
        type="password"
        label="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleLogin}>
        Войти
      </Button>
    </Box>
  );
};

export default Login;