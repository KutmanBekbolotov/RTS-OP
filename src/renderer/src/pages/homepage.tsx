import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import gerb from "../assets/gerb.svg";

function Home() {
    return(
        <Box sx={{ display: "flex", height: "100vh" }}>
        <Box
          sx={{
            width: "250px",
            backgroundColor: "#1976d2",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Button onClick={() => window.location.href = "/registration"} variant="contained" fullWidth sx={{ mb: 2 }}>
            Регистрация
          </Button>
          <Button component={Link} to="/search" variant="contained" fullWidth sx={{ mb: 2 }}>
            Поиск
          </Button>
          <Button component={Link} to="/directory" variant="contained" fullWidth>
            Справочник
          </Button>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={gerb} alt="Герб КР" width={200} />
          <Typography variant="h4" sx={{ mt: 2, textAlign: "center", maxWidth: "600px" }}>
            Государственное агентство по регистрации транспортных средств и водительского состава
          </Typography>
        </Box>
      </Box>

    );
}
 export default Home;