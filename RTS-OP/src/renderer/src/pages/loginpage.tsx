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
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        width: "100vw", 
        bgcolor: "#f5f5f5",
        textAlign: "center",
        padding: 2
      }}
    >
      <Paper 
        sx={{ 
          width: 400, 
          padding: 3, 
          boxShadow: 3, 
          borderRadius: 2, 
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img 
          src={gerb} 
          alt="Герб КР" 
          width={100} 
          style={{ marginBottom: "10px" }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Введите пароль для входа
        </Typography>
        <TextField
          type="password"
          label="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: "100%", mb: 2 }}
          variant="outlined"
          fullWidth
        />
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
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
    </Box>
  );
};

export default Login;
