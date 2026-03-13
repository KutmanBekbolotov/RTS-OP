import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import TechPassportPrint from "@/components/TechPassportPrint";
import CertificateContent from "@/components/certificateContent";
import { SearchResult as SharedSearchResult } from "@/components/types";

type SearchResult = SharedSearchResult & {
  id: number | null;
};

type EditableFieldKey = Exclude<keyof SearchResult, "id">;

const SPRAVKA_FIELDS: Array<{ key: EditableFieldKey; label: string; type?: "date" }> = [
  { key: "registrationType", label: "Тип регистрации" },
  { key: "registrationDate", label: "Дата регистрации", type: "date" },
  { key: "receiveDate", label: "Дата получения", type: "date" },
  { key: "territorialDepartment", label: "Территориальный отдел" },
  { key: "district", label: "Район" },
  { key: "organizationName", label: "Наименование органа" },
  { key: "subdivision", label: "Подразделение" },
  { key: "address", label: "Адрес органа" },
  { key: "stateNumber", label: "Гос номер" },
  { key: "techPassportNumber", label: "Номер техпаспорта" },
  { key: "expirationDate", label: "Срок окончания", type: "date" },
  { key: "submissionDate", label: "Дата сдачи техпаспорта", type: "date" },
  { key: "stateNumberSubmissionDate", label: "Дата сдачи гос номера", type: "date" },
  { key: "note", label: "Примечание" },
];

const TECH_PASSPORT_FIELDS: Array<{ key: EditableFieldKey; label: string; type?: "date" }> = [
  { key: "model", label: "Модель" },
  { key: "yearOfManufacture", label: "Год выпуска" },
  { key: "color", label: "Цвет" },
  { key: "vin", label: "VIN" },
  { key: "chassisNumber", label: "№ кузова / шасси" },
  { key: "bodyType", label: "Тип кузова" },
  { key: "seatCount", label: "Кол-во мест" },
  { key: "fuelType", label: "Тип топлива" },
  { key: "engineCapacity", label: "Объём двигателя" },
  { key: "enginePower", label: "Мощность двигателя" },
  { key: "unladenMass", label: "Масса без нагрузки" },
  { key: "maxPermissibleMass", label: "Макс. масса" },
  { key: "registrationNumber", label: "Рег. номер" },
  { key: "vid", label: "VID" },
  { key: "owner", label: "Собственник" },
  { key: "personalNumber", label: "ПИН / ИСН" },
  { key: "ownerAddress", label: "Адрес собственника" },
  { key: "issuingAuthority", label: "Орган выдачи" },
  { key: "authorizedSignature", label: "Подпись уполномоченного" },
];

const ALL_EDITABLE_FIELDS = [...SPRAVKA_FIELDS, ...TECH_PASSPORT_FIELDS];

const Search = () => {
  const [searchType, setSearchType] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<SearchResult | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toNullable = (value: string | null) => {
    const normalized = (value ?? "").trim();
    return normalized === "" ? null : normalized;
  };

  const handleSearch = async () => {
    setError(null);
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) {
      setError("Введите номер для поиска");
      return;
    }

    try {
      const searchBy = searchType === 0 ? "stateNumber" : "techPassportNumber";
      const result = await window.electron.searchVehicle({
        type: searchBy,
        query: normalizedQuery,
      });

      if (!result) {
        setError("Ничего не найдено");
        setSearchResult(null);
      } else {
        setSearchResult(result);
        setEditOpen(false);
        setEditData(null);
        setEditError(null);
      }
    } catch (searchError) {
      console.error("Ошибка поиска:", searchError);
      setError("Ошибка при выполнении поиска");
      setSearchResult(null);
    }
  };

  const handlePrint = async (elementId: string) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) {
      return;
    }

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

    try {
      const pdfPath = await window.electron.openPDFPreview(html);
      await window.electron.printGeneratedPDF(pdfPath);
    } catch (printError) {
      console.error("Ошибка печати:", printError);
      setError("Ошибка при печати документа");
    }
  };

  const handleOpenEdit = () => {
    if (!searchResult) {
      return;
    }

    setEditData({ ...searchResult });
    setEditError(null);
    setEditOpen(true);
  };

  const handleEditChange = (field: EditableFieldKey, value: string) => {
    setEditData((prev) => {
      if (!prev) {
        return prev;
      }

      const updated: SearchResult = { ...prev, [field]: value };
      if (field === "address") {
        updated.ownerAddress = value;
      }

      return updated;
    });
  };

  const handleSaveEdit = async () => {
    if (!editData || !editData.id) {
      setEditError("Не удалось определить запись для обновления.");
      return;
    }

    setIsSaving(true);
    setEditError(null);
    try {
      const payload: Record<string, string | number | null> = { id: editData.id };
      for (const field of ALL_EDITABLE_FIELDS) {
        payload[field.key] = toNullable(editData[field.key]);
      }
      payload.fullName = null;

      const response = await window.electron.updateRegistration(payload);
      setSearchResult(response.data);
      setEditOpen(false);
      setEditData(null);
    } catch (updateError) {
      console.error("Ошибка обновления:", updateError);
      setEditError("Не удалось сохранить изменения. Проверьте уникальность гос номера и техпаспорта.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box className="page-shell">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Поиск
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ minWidth: "120px" }}>
          Назад
        </Button>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "1px solid #d8e1ef",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Tabs value={searchType} onChange={(_, newValue) => setSearchType(newValue)} sx={{ mb: 3 }}>
          <Tab label="Поиск по гос. номеру" />
          <Tab label="Поиск по номеру техпаспорта" />
        </Tabs>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
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
            sx={{ minWidth: { sm: "120px" }, height: "56px" }}
          >
            Поиск
          </Button>
        </Box>
      </Paper>

     {searchResult && (
  <>
  <CertificateContent data={searchResult} />

  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2, flexWrap: "wrap" }}>
    <Button variant="contained" onClick={() => handlePrint("print-certificate")}>
      Печать справки
    </Button>
    <Button variant="contained" onClick={() => handlePrint("print-passport")}>
      Печать техпаспорта
    </Button>
    <Button variant="outlined" onClick={handleOpenEdit}>
      Изменить данные
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
        font-size: 18px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        box-sizing: border-box;
        align-items: flex-end;
      }
      .main-info-right {
        width: 100%;
        padding-top: 15%;
        font-size: 18px;
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
       align-items:flex-end;
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

      <Dialog
        open={editOpen}
        onClose={() => {
          if (!isSaving) {
            setEditOpen(false);
          }
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Редактирование данных</DialogTitle>
        <DialogContent dividers>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}

          <Typography variant="h6" sx={{ mb: 1 }}>
            Данные справки
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 3,
            }}
          >
            {SPRAVKA_FIELDS.map((field) => (
              <TextField
                key={field.key}
                label={field.label}
                type={field.type === "date" ? "date" : "text"}
                value={editData ? (editData[field.key] ?? "") : ""}
                onChange={(e) => handleEditChange(field.key, e.target.value)}
                InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                fullWidth
              />
            ))}
          </Box>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Данные техпаспорта
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {TECH_PASSPORT_FIELDS.map((field) => (
              <TextField
                key={field.key}
                label={field.label}
                type={field.type === "date" ? "date" : "text"}
                value={editData ? (editData[field.key] ?? "") : ""}
                onChange={(e) => handleEditChange(field.key, e.target.value)}
                InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                fullWidth
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (!isSaving) {
                setEditOpen(false);
              }
            }}
          >
            Отмена
          </Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={isSaving}>
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};




export default Search;
