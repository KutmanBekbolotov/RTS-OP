import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import gerb from "../assets/gerb.svg";

function Home({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box
                sx={{
                    width: "220px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                    gap: 2,
                }}
            >
                <Button component={Link} to="/registration" variant="contained" fullWidth>
                    Регистрация
                </Button>
                <Button component={Link} to="/search" variant="contained" fullWidth>
                    Поиск
                </Button>
                <Button component={Link} to="/directory" variant="contained" fullWidth>
                    Справочник
                </Button>
                <Button onClick={handleLogout} variant="contained" color="error" fullWidth>
                    Выход
                </Button>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "20px",
                }}
            >
                <img src={gerb} alt="Герб КР" width={200} />
                <Typography variant="h4" sx={{ mt: 2, maxWidth: "600px" }}>
                    Государственное центр по регистрации транспортных средств и водительского состава
                </Typography>
            </Box>
        </Box>
    );
}

export default Home;
