import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import gerb from "../assets/gerb.svg";

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
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        bgcolor: "#f5f5f5",
        position: "relative" // Позволяет позиционировать герб относительно родителя
      }}
    >
      <Paper 
        sx={{ 
          width: 400, 
          padding: 3, 
          boxShadow: 3, 
          borderRadius: 2, 
          bgcolor: "white" 
        }}
      >
        <Typography variant="h5" align="center" sx={{ fontWeight: 600, mb: 2 }}>
          Введите пароль для входа
        </Typography>
        <TextField
          type="password"
          label="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ 
            width: "100%", 
            mb: 2 
          }}
          variant="outlined"
          fullWidth
        />
        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
        <Button 
          variant="contained" 
          onClick={handleLogin} 
          sx={{ 
            width: "100%", 
            backgroundColor: "#1976d2", 
            "&:hover": {
              backgroundColor: "#1565c0"
            }
          }}
        >
          Войти
        </Button>
      </Paper>
      <img 
        src={gerb} 
        alt="Герб КР" 
        width={400}
        style={{
          position: "absolute", 
          right: -550,  
          bottom: 250   
        }} 
      />
    </Box>
  );
};

export default Login;