import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TableCell,
  TableRow,
} from "@mui/material";
import TechPassportPrint from "@/components/TechPassportPrint";
import CertificateContent from "@/components/certificateContent";

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

  const handlePrint = async (elementId: string) => {
  const printContent = document.getElementById(elementId);
  if (printContent) {
    const clone = printContent.cloneNode(true) as HTMLElement;
    clone.style.visibility = "visible";
    clone.style.position = "static";

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

    await window.electron.openPDFPreview(html);
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
  <CertificateContent data={searchResult} />

  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
    <Button variant="contained" onClick={() => handlePrint("print-certificate")}>
      Печать справки
    </Button>
    <Button variant="contained" onClick={() => handlePrint("print-passport")}>
      Печать техпаспорта
    </Button>
  </Box>
    
   <div
  id="print-certificate"
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
        font-family: sans-serif;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      td {
        border: 1px solid black;
        padding: 6px;
        font-size: 12px;
      }

      h5 {
        text-align: center;
        font-weight: bold;
        margin-bottom: 16px;
      }

      .certificate-print {
        padding: 16px;
      }
    `}
  </style>

  <div className="certificate-print">
    <CertificateContent data={searchResult} />
  </div>
</div>

<div
  id="print-passport"
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
      }
      .container {
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .main-info-left {
        width: 100%;
        padding-top: 15%;
        font-size: 9px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        box-sizing: border-box;
        align-items: flex-end;
      }
      .main-info-right {
        width: 100%;
        padding-top: 15%;
        font-size: 9px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        box-sizing: border-box;
        align-items: flex-end;
      }
      .main-info-right-top {
        display: flex;
        flex-direction: column;
        gap: 21px;
      }
      .main-info-right-middle {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 9.5%;
        align-items: flex-end;
        width: 50%;
      }
      .main-info-right-bottom {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 3.8%;
        width: 20%;
      }
      h6 {
        display: none !important;
      }
      .address {
       align-items:flex-end
       text-align: end;
       width: 70%;
      }
      .address span {
        display: block;
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-word;
        text-align: left;
      }
      .tech-passport-print {
        width: 97%;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        display: flex;
        flex-direction: column;
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
