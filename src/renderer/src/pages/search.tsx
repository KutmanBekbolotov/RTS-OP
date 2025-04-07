import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import TechPassportPrint from "@/components/TechPassportPrint"; // Импортируем компонент для печати техпаспорта

// Тип для результатов поиска
interface SearchResult {
  registrationType: string;
  registrationDate: string;
  receiveDate: string;
  territorialDepartment: string;
  district: string;
  organizationName: string;
  subdivision: string;
  address: string;
  stateNumber: string;
  techPassportNumber: string;
  expirationDate: string;
  submissionDate: string;
  stateNumberSubmissionDate: string;
  fullName: string;
  note: string;
}

// Тип для состояния поиска
type RegistrationType =
  | "primary"
  | "replacement_number_and_tech_passport"
  | "replacement_number_only"
  | "replacement_tech_passport_only";

const translations = {
  registrationType: {
    primary: "Первичная",
    replacement_number_and_tech_passport: "Замена гос номера и техпаспорта",
    replacement_number_only: "Замена гос номера без замены техпаспорта",
    replacement_tech_passport_only: "Замена техпаспорта без замены гос номера",
  } as Record<string, string>,
};

const Search = () => {
  const [searchType, setSearchType] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTechPassport, setShowTechPassport] = useState(false); // Для отображения компонента техпаспорта

  // Функция для выполнения поиска
  const handleSearch = async () => {
    setError(null);
    if (!searchQuery.trim()) {
      setError("Введите номер для поиска");
      return;
    }

    const searchBy = searchType === 0 ? "stateNumber" : "techPassportNumber";
    const result = await window.electron.searchVehicle({
      type: searchBy,
      query: searchQuery,
    });

    if (!result) {
      setError("Ничего не найдено");
      setSearchResult(null);
    } else {
      setSearchResult(result);
    }
  };

  // Функция для печати
  const handlePrint = () => {
    window.print();
  };

  // Функция для отображения техпаспорта
  const handlePrintTechPassport = () => {
    setShowTechPassport(true); // Показываем компонент для печати техпаспорта
  };

  // Рендеринг поля для таблицы
  const renderField = (label: string, value: string | null) => (
    <TableRow>
      <TableCell sx={{ border: "1px solid black", padding: "6px" }}>
        {label}
      </TableCell>
      <TableCell sx={{ border: "1px solid black", padding: "6px" }}>
        {value || "-"}
      </TableCell>
    </TableRow>
  );

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "100%",
        margin: "0 auto",
        "@media print": {
          padding: 0,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 20,
          width: "100%",
          "@media print": {
            display: "none",
          },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Поиск
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{ minWidth: "120px" }}
        >
          Назад
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 10, "@media print": { display: "none" } }}>
        <Tabs
          value={searchType}
          onChange={(_, newValue) => setSearchType(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Поиск по гос. номеру" />
          <Tab label="Поиск по номеру техпаспорта" />
        </Tabs>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label={searchType === 0 ? "Гос. номер" : "Номер техпаспорта"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            error={!!error}
            helperText={error}
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: "120px", height: "56px" }}
          >
            Поиск
          </Button>
        </Box>
      </Paper>

      {searchResult && (
        <Box
          sx={{
            mt: 4,
            "@media print": {
              mt: 0,
              width: "210mm",
              minHeight: "330mm",
              padding: "30mm",
              boxSizing: "border-box",
            },
          }}
        >
          <Paper
            sx={{
              p: 3,
              "@media print": {
                p: 0,
                boxShadow: "none",
                border: "none",
              },
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontWeight: "bold",
                mb: 2,
                "@media print": { mt: 0, fontSize: "24px" },
              }}
            >
              СПРАВКА
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 2, fontSize: "16px", "@media print": { fontSize: "14px" } }}
            >
              Дата: {new Date().toLocaleDateString("ru-RU")}
            </Typography>

            <TableContainer>
              <Table sx={{ border: "1px solid black" }}>
                <TableBody>
                  {renderField(
                    "Тип регистрации",
                    translations.registrationType[
                      searchResult.registrationType as RegistrationType
                    ] || searchResult.registrationType
                  )}
                  {renderField("Дата регистрации", searchResult.registrationDate)}
                  {renderField("Дата получения", searchResult.receiveDate)}
                  {renderField("Территориальный отдел", searchResult.territorialDepartment)}
                  {renderField("Наименование органа", searchResult.organizationName)}
                  {renderField("Подразделение", searchResult.subdivision)}
                  {renderField("Адрес", searchResult.address)}
                  {renderField("Гос. номер", searchResult.stateNumber)}
                  {renderField("Номер техпаспорта", searchResult.techPassportNumber)}
                  {renderField("Срок окончания", searchResult.expirationDate)}
                  {renderField("Дата сдачи", searchResult.submissionDate)}
                  {renderField("Дата сдачи гос. номера", searchResult.stateNumberSubmissionDate)}
                  {renderField("ФИО", searchResult.fullName)}
                  {renderField("Примечание", searchResult.note)}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography sx={{ mt: 4, fontSize: "16px" }}>
              Подпись ответственного лица: _______________________
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" onClick={handlePrint}>
                Печать
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePrintTechPassport}
                sx={{ ml: 2 }}
              >
                Печать техпаспорта
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {showTechPassport && searchResult && (
        <TechPassportPrint searchResult={searchResult} />
      )}
    </Box>
  );
};

export default Search;
