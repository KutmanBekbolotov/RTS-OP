import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

interface Subdivision {
  id: number;
  authorityId: number;
  name: string;
}

interface AuthorityDirectoryItem {
  id: number;
  name: string;
  subdivisions: Subdivision[];
}

const Directory = () => {
  const [directory, setDirectory] = useState<AuthorityDirectoryItem[]>([]);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<number | null>(null);
  const [authorityName, setAuthorityName] = useState("");
  const [subdivisionName, setSubdivisionName] = useState("");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const selectedAuthority = directory.find((item) => item.id === selectedAuthorityId) ?? null;

  const loadDirectory = async (preferredAuthorityId?: number | null) => {
    try {
      const result = await window.electron.getAuthorityDirectory();
      setDirectory(result);
      setSelectedAuthorityId((prev) => {
        const targetId = preferredAuthorityId ?? prev;
        if (targetId && result.some((item) => item.id === targetId)) {
          return targetId;
        }

        return result.length > 0 ? result[0].id : null;
      });
    } catch (error) {
      console.error("Ошибка загрузки госорганов:", error);
      setNotification({
        open: true,
        message: "Не удалось загрузить список госорганов.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    void loadDirectory();
  }, []);

  const handleAddAuthority = async () => {
    const normalizedName = authorityName.trim();
    if (!normalizedName) {
      setNotification({
        open: true,
        message: "Введите наименование госоргана.",
        severity: "error",
      });
      return;
    }

    try {
      const created = await window.electron.addAuthority(normalizedName);
      setAuthorityName("");
      await loadDirectory(created.id);
      setNotification({
        open: true,
        message: "Госорган добавлен.",
        severity: "success",
      });
    } catch (error) {
      console.error("Ошибка добавления госоргана:", error);
      setNotification({
        open: true,
        message: "Не удалось добавить госорган (возможно, уже существует).",
        severity: "error",
      });
    }
  };

  const handleDeleteAuthority = async (id: number) => {
    try {
      await window.electron.deleteAuthority(id);
      const preferredAuthorityId = selectedAuthorityId === id ? null : selectedAuthorityId;
      await loadDirectory(preferredAuthorityId);
      setNotification({
        open: true,
        message: "Госорган удален.",
        severity: "success",
      });
    } catch (error) {
      console.error("Ошибка удаления госоргана:", error);
      setNotification({
        open: true,
        message: "Не удалось удалить госорган.",
        severity: "error",
      });
    }
  };

  const handleAddSubdivision = async () => {
    if (!selectedAuthorityId) {
      setNotification({
        open: true,
        message: "Сначала выберите госорган.",
        severity: "error",
      });
      return;
    }

    const normalizedName = subdivisionName.trim();
    if (!normalizedName) {
      setNotification({
        open: true,
        message: "Введите наименование подразделения.",
        severity: "error",
      });
      return;
    }

    try {
      await window.electron.addSubdivision({
        authorityId: selectedAuthorityId,
        name: normalizedName,
      });
      setSubdivisionName("");
      await loadDirectory(selectedAuthorityId);
      setNotification({
        open: true,
        message: "Подразделение добавлено.",
        severity: "success",
      });
    } catch (error) {
      console.error("Ошибка добавления подразделения:", error);
      setNotification({
        open: true,
        message: "Не удалось добавить подразделение (возможно, уже существует).",
        severity: "error",
      });
    }
  };

  const handleDeleteSubdivision = async (id: number) => {
    try {
      await window.electron.deleteSubdivision(id);
      await loadDirectory(selectedAuthorityId);
      setNotification({
        open: true,
        message: "Подразделение удалено.",
        severity: "success",
      });
    } catch (error) {
      console.error("Ошибка удаления подразделения:", error);
      setNotification({
        open: true,
        message: "Не удалось удалить подразделение.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Справочник госорганов</Typography>
        <Button component={Link} to="/" variant="outlined">
          Назад
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Наименование госоргана"
            value={authorityName}
            onChange={(e) => setAuthorityName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddAuthority} sx={{ minWidth: 140 }}>
            Добавить
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Органы
          </Typography>

          {directory.length === 0 ? (
            <Typography color="text.secondary">Список пуст.</Typography>
          ) : (
            <List>
              {directory.map((authority) => (
                <ListItem
                  key={authority.id}
                  disablePadding
                  secondaryAction={
                    <Button color="error" onClick={() => void handleDeleteAuthority(authority.id)}>
                      Удалить
                    </Button>
                  }
                >
                  <ListItemButton
                    selected={selectedAuthorityId === authority.id}
                    onClick={() => setSelectedAuthorityId(authority.id)}
                  >
                    <ListItemText primary={authority.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Подразделения {selectedAuthority ? `(${selectedAuthority.name})` : ""}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Наименование подразделения"
              value={subdivisionName}
              onChange={(e) => setSubdivisionName(e.target.value)}
              fullWidth
              disabled={!selectedAuthority}
            />
            <Button
              variant="contained"
              onClick={handleAddSubdivision}
              sx={{ minWidth: 140 }}
              disabled={!selectedAuthority}
            >
              Добавить
            </Button>
          </Box>

          {!selectedAuthority ? (
            <Typography color="text.secondary">Выберите госорган слева.</Typography>
          ) : selectedAuthority.subdivisions.length === 0 ? (
            <Typography color="text.secondary">У выбранного органа пока нет подразделений.</Typography>
          ) : (
            <List>
              {selectedAuthority.subdivisions.map((subdivision) => (
                <ListItem
                  key={subdivision.id}
                  secondaryAction={
                    <Button color="error" onClick={() => void handleDeleteSubdivision(subdivision.id)}>
                      Удалить
                    </Button>
                  }
                >
                  <ListItemText primary={subdivision.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Directory;
