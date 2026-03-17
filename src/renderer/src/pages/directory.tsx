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

type SimpleDirectoryType = "registrationType" | "district";

interface SimpleDirectoryItem {
  id: number;
  type: SimpleDirectoryType;
  name: string;
}

interface SimpleDirectorySectionProps {
  title: string;
  inputLabel: string;
  addButtonLabel: string;
  emptyText: string;
  value: string;
  items: SimpleDirectoryItem[];
  onChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const cardSx = {
  p: 2,
  borderRadius: 3,
  border: "1px solid #d8e1ef",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.92)",
};

const SimpleDirectorySection = ({
  title,
  inputLabel,
  addButtonLabel,
  emptyText,
  value,
  items,
  onChange,
  onAdd,
  onDelete,
}: SimpleDirectorySectionProps) => (
  <Paper sx={cardSx}>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>
      {title}
    </Typography>

    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextField
        label={inputLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={onAdd} sx={{ minWidth: 140 }}>
        {addButtonLabel}
      </Button>
    </Box>

    {items.length === 0 ? (
      <Typography color="text.secondary">{emptyText}</Typography>
    ) : (
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <Button color="error" onClick={() => onDelete(item.id)}>
                Удалить
              </Button>
            }
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    )}
  </Paper>
);

const Directory = () => {
  const [directory, setDirectory] = useState<AuthorityDirectoryItem[]>([]);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<number | null>(null);
  const [authorityName, setAuthorityName] = useState("");
  const [subdivisionName, setSubdivisionName] = useState("");
  const [registrationTypeName, setRegistrationTypeName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [registrationTypes, setRegistrationTypes] = useState<SimpleDirectoryItem[]>([]);
  const [districts, setDistricts] = useState<SimpleDirectoryItem[]>([]);
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

  const showNotification = (message: string, severity: "success" | "error") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const loadAuthorityDirectory = async (preferredAuthorityId?: number | null) => {
    const result = await window.electron.getAuthorityDirectory();
    setDirectory(result);
    setSelectedAuthorityId((prev) => {
      const targetId = preferredAuthorityId ?? prev;
      if (targetId && result.some((item) => item.id === targetId)) {
        return targetId;
      }

      return result.length > 0 ? result[0].id : null;
    });
  };

  const loadSimpleDirectory = async (type: SimpleDirectoryType) => {
    const result = await window.electron.getSimpleDirectoryItems(type);
    if (type === "registrationType") {
      setRegistrationTypes(result);
      return;
    }

    setDistricts(result);
  };

  const loadAllDirectories = async (preferredAuthorityId?: number | null) => {
    try {
      await Promise.all([
        loadAuthorityDirectory(preferredAuthorityId),
        loadSimpleDirectory("registrationType"),
        loadSimpleDirectory("district"),
      ]);
    } catch (error) {
      console.error("Ошибка загрузки справочников:", error);
      showNotification("Не удалось загрузить справочники.", "error");
    }
  };

  useEffect(() => {
    void loadAllDirectories();
  }, []);

  const handleAddAuthority = async () => {
    const normalizedName = authorityName.trim();
    if (!normalizedName) {
      showNotification("Введите наименование госоргана.", "error");
      return;
    }

    try {
      const created = await window.electron.addAuthority(normalizedName);
      setAuthorityName("");
      await loadAuthorityDirectory(created.id);
      showNotification("Госорган добавлен.", "success");
    } catch (error) {
      console.error("Ошибка добавления госоргана:", error);
      showNotification("Не удалось добавить госорган (возможно, уже существует).", "error");
    }
  };

  const handleDeleteAuthority = async (id: number) => {
    try {
      await window.electron.deleteAuthority(id);
      const preferredAuthorityId = selectedAuthorityId === id ? null : selectedAuthorityId;
      await loadAuthorityDirectory(preferredAuthorityId);
      showNotification("Госорган удален.", "success");
    } catch (error) {
      console.error("Ошибка удаления госоргана:", error);
      showNotification("Не удалось удалить госорган.", "error");
    }
  };

  const handleAddSubdivision = async () => {
    if (!selectedAuthorityId) {
      showNotification("Сначала выберите госорган.", "error");
      return;
    }

    const normalizedName = subdivisionName.trim();
    if (!normalizedName) {
      showNotification("Введите наименование подразделения.", "error");
      return;
    }

    try {
      await window.electron.addSubdivision({
        authorityId: selectedAuthorityId,
        name: normalizedName,
      });
      setSubdivisionName("");
      await loadAuthorityDirectory(selectedAuthorityId);
      showNotification("Подразделение добавлено.", "success");
    } catch (error) {
      console.error("Ошибка добавления подразделения:", error);
      showNotification("Не удалось добавить подразделение (возможно, уже существует).", "error");
    }
  };

  const handleDeleteSubdivision = async (id: number) => {
    try {
      await window.electron.deleteSubdivision(id);
      await loadAuthorityDirectory(selectedAuthorityId);
      showNotification("Подразделение удалено.", "success");
    } catch (error) {
      console.error("Ошибка удаления подразделения:", error);
      showNotification("Не удалось удалить подразделение.", "error");
    }
  };

  const handleAddSimpleDirectoryItem = async (
    type: SimpleDirectoryType,
    value: string,
    reset: () => void,
    successMessage: string,
    errorMessage: string,
  ) => {
    const normalizedName = value.trim();
    if (!normalizedName) {
      showNotification("Введите значение справочника.", "error");
      return;
    }

    try {
      await window.electron.addSimpleDirectoryItem({
        type,
        name: normalizedName,
      });
      reset();
      await loadSimpleDirectory(type);
      showNotification(successMessage, "success");
    } catch (error) {
      console.error(`Ошибка добавления элемента справочника ${type}:`, error);
      showNotification(errorMessage, "error");
    }
  };

  const handleDeleteSimpleDirectoryItem = async (
    type: SimpleDirectoryType,
    id: number,
    successMessage: string,
    errorMessage: string,
  ) => {
    try {
      await window.electron.deleteSimpleDirectoryItem(id);
      await loadSimpleDirectory(type);
      showNotification(successMessage, "success");
    } catch (error) {
      console.error(`Ошибка удаления элемента справочника ${type}:`, error);
      showNotification(errorMessage, "error");
    }
  };

  return (
    <Box className="page-shell" sx={{ maxWidth: 1100 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Справочники</Typography>
        <Button component={Link} to="/" variant="outlined">
          Назад
        </Button>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #d8e1ef",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
      >
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

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" }, mb: 3 }}>
        <Paper sx={{ ...cardSx, flex: 1 }}>
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

        <Paper sx={{ ...cardSx, flex: 1 }}>
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

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        <SimpleDirectorySection
          title="Тип регистрации"
          inputLabel="Новый тип регистрации"
          addButtonLabel="Добавить"
          emptyText="Справочник типов регистрации пуст."
          value={registrationTypeName}
          items={registrationTypes}
          onChange={setRegistrationTypeName}
          onAdd={() =>
            void handleAddSimpleDirectoryItem(
              "registrationType",
              registrationTypeName,
              () => setRegistrationTypeName(""),
              "Тип регистрации добавлен.",
              "Не удалось добавить тип регистрации (возможно, уже существует).",
            )
          }
          onDelete={(id) =>
            void handleDeleteSimpleDirectoryItem(
              "registrationType",
              id,
              "Тип регистрации удален.",
              "Не удалось удалить тип регистрации.",
            )
          }
        />

        <SimpleDirectorySection
          title="Район"
          inputLabel="Новый район"
          addButtonLabel="Добавить"
          emptyText="Справочник районов пуст."
          value={districtName}
          items={districts}
          onChange={setDistrictName}
          onAdd={() =>
            void handleAddSimpleDirectoryItem(
              "district",
              districtName,
              () => setDistrictName(""),
              "Район добавлен.",
              "Не удалось добавить район (возможно, уже существует).",
            )
          }
          onDelete={(id) =>
            void handleDeleteSimpleDirectoryItem(
              "district",
              id,
              "Район удален.",
              "Не удалось удалить район.",
            )
          }
        />
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
