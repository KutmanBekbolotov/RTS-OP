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
  TableRow,
} from "@mui/material";
import TechPassportPrint from "@/components/TechPassportPrint";
import { PrintWrapper } from "../components/PrintWrapper";

export interface SearchResult {
  registrationType: string | null;
  registrationDate: string | null;
  receiveDate: string | null;
  territorialDepartment: string | null;
  district: string | null;
  organizationName: string | null;
  subdivision: string | null;
  address: string | null;
  stateNumber: string | null;
  techPassportNumber: string | null;
  expirationDate: string | null;
  submissionDate: string | null;
  stateNumberSubmissionDate: string | null;
  fullName: string | null;
  note: string | null;
  model: string | null;
  yearOfManufacture: string | null;
  color: string | null;
  vin: string | null;
  chassisNumber: string | null;
  bodyType: string | null;
  seatCount: string | null;
  fuelType: string | null;
  registrationNumber: string | null;
  vid: string | null;
  owner: string | null;
  personalNumber: string | null;
  ownerAddress: string | null;
  issuingAuthority: string | null;
  authorizedSignature: string | null;
  engineCapacity: string | null;
  enginePower: string | null;
  unladenMass: string | null;
  maxPermissibleMass: string | null;
}

const translations = {
  registrationType: {
    primary: "Первичная",
    replacement_number_and_tech_passport: "Замена гос номера и техпаспорта",
    replacement_number_only: "Замена гос номера без замены техпаспорта",
    replacement_tech_passport_only: "Замена техпаспорта без замены гос номера",
  },
};

type RegistrationType = keyof typeof translations.registrationType;

const Search = () => {
  const [searchType, setSearchType] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handlePrint = async () => {
    const printContent = document.getElementById("print-content");
    if (printContent) {
      const clone = printContent.cloneNode(true) as HTMLElement;
      clone.style.visibility = "visible";
      clone.style.position = "static";
      clone.style.top = "";
      clone.style.left = "";

      const tempDiv = document.createElement("div");
      tempDiv.appendChild(clone);

      const html = `
        <html>
          <head>
            <style>
              @page {
                size: auto;
                margin: 0;
              }
              html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
              }
              .tech-passport-print {
                width: 100vw;
                height: 100vh;
                box-sizing: border-box;
                padding: 0;
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>${tempDiv.innerHTML}</body>
        </html>
      `;

      const pdfPath = await window.electron.openPDFPreview(html);
      if (pdfPath) {
        await window.electron.printGeneratedPDF(pdfPath);
      }
    }
  };

  const renderField = (label: string, value: string | null) => (
    <TableRow>
      <TableCell sx={{ border: "1px solid black", padding: "6px" }}>{label}</TableCell>
      <TableCell sx={{ border: "1px solid black", padding: "6px" }}>{value || "-"}</TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ padding: "20px", maxWidth: "100%", margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 20,
          width: "100%",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Поиск
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ minWidth: "120px" }}>
          Назад
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 10 }}>
        <Tabs value={searchType} onChange={(_, newValue) => setSearchType(newValue)} sx={{ mb: 3 }}>
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
          <Button variant="contained" onClick={handleSearch} sx={{ minWidth: "120px", height: "56px" }}>
            Поиск
          </Button>
        </Box>
      </Paper>

      {searchResult && (
        <>
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
                СПРАВКА
              </Typography>

              <Typography variant="body2" sx={{ mb: 2, fontSize: "16px" }}>
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
                    {renderField("Объем двигателя", searchResult.engineCapacity)}
                    {renderField("Мощность двигателя", searchResult.enginePower)}
                    {renderField("Собственная масса", searchResult.unladenMass)}
                    {renderField("Макс. разрешенная масса", searchResult.maxPermissibleMass)}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography sx={{ mt: 4, fontSize: "16px" }}>
                Подпись ответственного лица: _______________________
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button variant="contained" onClick={handlePrint}>
                  Предпросмотр и печать
                </Button>
              </Box>
            </Paper>
          </Box>

          <div
            id="print-content"
            style={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              width: "14.80cm",
              height: "10.50cm",
              visibility: "hidden",
            }}
          >
            <style>
              {`
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  size: 14.80cm 10.50cm;
                }
                .container {
                  display: flex;
                  justify-content: space-between;
                }
                .main-info-left {
                  font-size: 22px;
                  display: flex;
                  flex-direction: column;
                  gap: 15px;
                  margin-left: 70%;
                  padding-top: 22%;
                }
                .main-info-right {
                  font-size: 22px;
                  display: flex;
                  flex-direction: column;
                  gap: 15px;
                  margin-left: 35%;
                  padding-top: 22%;
                  justify-content: space-between;
                  height: 100%;
                }
                .main-info-right-top,
                .main-info-right-bottom {
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
                }
                .tech-passport-print {
                  width: 100%;
                  height: 100%;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                  box-sizing: border-box;
                  padding: 0;
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                }
                h6 {
                  display: none !important;
                }
              `}
            </style>
            <TechPassportPrint searchResult={searchResult} />
          </div>
        </>
      )}
    </Box>
  );
};

export default Search;
