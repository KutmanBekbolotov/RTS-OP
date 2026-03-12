import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import gerb from "../assets/gerb.svg"

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const isValid = await window.electron.checkPassword(password);
      if (isValid) {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        setError("");
        navigate("/");
      } else {
        setError("Неверный пароль");
      }
    } catch (loginError) {
      console.error("Ошибка авторизации:", loginError);
      setError("Ошибка проверки пароля");
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
        width: "100%",
        textAlign: "center",
        px: 2,
      }}
    >
      <Paper 
        sx={{ 
          width: "min(420px, 100%)",
          p: 3,
          borderRadius: 3,
          border: "1px solid #d8e1ef",
          boxShadow: "0 22px 46px rgba(15, 23, 42, 0.14)",
          bgcolor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "pageIn 380ms ease-out",
        }}
      >
        <img 
          src={gerb} 
          alt="Герб КР" 
          width={100} 
          style={{ marginBottom: "10px" }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
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
            borderRadius: 2,
            backgroundColor: "#1d4ed8",
            boxShadow: "0 8px 22px rgba(29, 78, 216, 0.28)",
            transition: "transform 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              backgroundColor: "#1e40af",
              transform: "translateY(-1px)",
              boxShadow: "0 12px 24px rgba(30, 64, 175, 0.32)",
            },
          }}
        >
          Войти
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
