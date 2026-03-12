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
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <Box
                sx={{
                    width: { xs: "200px", sm: "240px" },
                    background: "linear-gradient(180deg, #0f4fbf 0%, #1f6bd8 100%)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: { xs: 1.5, sm: 2.5 },
                    gap: 2,
                    boxShadow: "8px 0 28px rgba(15, 79, 191, 0.24)",
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
                <Button component={Link} to="/reports" variant="contained" fullWidth>
                    Отчеты
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
                    p: 3,
                }}
            >
                <Box
                    sx={{
                        width: "min(760px, 100%)",
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 4,
                        border: "1px solid #d8e1ef",
                        backgroundColor: "rgba(255,255,255,0.92)",
                        boxShadow: "0 24px 48px rgba(15, 23, 42, 0.10)",
                        animation: "pageIn 360ms ease-out",
                    }}
                >
                    <img src={gerb} alt="Герб КР" width={180} />
                    <Typography variant="h4" sx={{ mt: 2, maxWidth: "680px", mx: "auto", fontWeight: 700 }}>
                        Государственное центр по регистрации транспортных средств и водительского состава
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
