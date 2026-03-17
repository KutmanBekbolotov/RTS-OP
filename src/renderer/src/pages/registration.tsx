import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box, Typography, Snackbar, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TechPassportPrint from "@/components/TechPassportPrint";
import { SearchResult } from "@/components/types";

interface SpravkaProps {
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
  note: string;
}

interface TechPassportProps {
  model: string;
  yearOfManufacture: string;
  color: string;
  vin: string;
  chassisNumber: string;
  bodyType: string;
  seatCount: string;
  fuelType: string;
  engineCapacity: string;
  enginePower: string;
  unladenMass: string;
  maxPermissibleMass: string;
  registrationNumber: string;
  vid: string;
  owner: string;
  personalNumber: string;
  ownerAddress: string;
  issuingAuthority: string;
  authorizedSignature: string;
}

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

interface SimpleDirectoryItem {
  id: number;
  type: "registrationType" | "district";
  name: string;
}

const defaultSpravka: SpravkaProps = {
  registrationType: "",
  registrationDate: "",
  receiveDate: "",
  territorialDepartment: "ГЦ РТСВС",
  district: "",
  organizationName: "",
  subdivision: "",
  address: "",
  stateNumber: "",
  techPassportNumber: "",
  expirationDate: "",
  submissionDate: "",
  stateNumberSubmissionDate: "",
  note: "",
};

const defaultTechPassport: TechPassportProps = {
  model: "ОП",
  yearOfManufacture: "",
  color: "",
  vin: "",
  chassisNumber: "",
  bodyType: "",
  seatCount: "",
  fuelType: "",
  engineCapacity: "",
  enginePower: "",
  unladenMass: "",
  maxPermissibleMass: "",
  registrationNumber: "",
  vid: "",
  owner: "",
  personalNumber: "",
  ownerAddress: "",
  issuingAuthority: "ГЦ РТСВС",
  authorizedSignature: "",
};

const RegistrationForm = () => {
  const [spravkaData, setSpravkaData] = useState<SpravkaProps>(defaultSpravka);
  const [techPassportData, setTechPassportData] = useState<TechPassportProps>(defaultTechPassport);
  const [authorityDirectory, setAuthorityDirectory] = useState<AuthorityDirectoryItem[]>([]);
  const [registrationTypeDirectory, setRegistrationTypeDirectory] = useState<SimpleDirectoryItem[]>([]);
  const [districtDirectory, setDistrictDirectory] = useState<SimpleDirectoryItem[]>([]);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadDirectories = async () => {
      try {
        const [authorityResult, registrationTypeResult, districtResult] = await Promise.all([
          window.electron.getAuthorityDirectory(),
          window.electron.getSimpleDirectoryItems("registrationType"),
          window.electron.getSimpleDirectoryItems("district"),
        ]);

        setAuthorityDirectory(authorityResult);
        setRegistrationTypeDirectory(registrationTypeResult);
        setDistrictDirectory(districtResult);
      } catch (error) {
        console.error("Ошибка загрузки справочников:", error);
      }
    };

    void loadDirectories();
  }, []);

  const normalizeName = (value: string) => value.trim().toLowerCase();

  const authorityNames = authorityDirectory.map((item) => item.name);
  const registrationTypeOptions = registrationTypeDirectory.map((item) => item.name);
  const districtOptions = districtDirectory.map((item) => item.name);

  const selectedOrganization = authorityDirectory.find(
    (item) => normalizeName(item.name) === normalizeName(spravkaData.organizationName),
  );

  const subdivisionOptions = selectedOrganization
    ? selectedOrganization.subdivisions.map((item) => item.name)
    : [];

  const getFieldValue = (field: string): string =>
    field in spravkaData
      ? spravkaData[field as keyof SpravkaProps]
      : techPassportData[field as keyof TechPassportProps];

  const handleChange = (field: string, value: string) => {
    if (field in spravkaData) {
      setSpravkaData((prev) => ({ ...prev, [field]: value }));
      if (field === "address") {
        setTechPassportData((prev) => ({ ...prev, ownerAddress: value }));
      }
    } else if (field in techPassportData) {
      setTechPassportData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const toPrintableValue = (value: string): string | null => {
    const normalized = value.trim();
    return normalized === "" ? null : normalized;
  };

  const buildTechPassportPrintData = (): SearchResult => ({
    registrationType: toPrintableValue(spravkaData.registrationType),
    registrationDate: toPrintableValue(spravkaData.registrationDate),
    receiveDate: toPrintableValue(spravkaData.receiveDate),
    territorialDepartment: toPrintableValue(spravkaData.territorialDepartment),
    district: toPrintableValue(spravkaData.district),
    organizationName: toPrintableValue(spravkaData.organizationName),
    subdivision: toPrintableValue(spravkaData.subdivision),
    address: toPrintableValue(spravkaData.address),
    stateNumber: toPrintableValue(spravkaData.stateNumber),
    techPassportNumber: toPrintableValue(spravkaData.techPassportNumber),
    expirationDate: toPrintableValue(spravkaData.expirationDate),
    submissionDate: toPrintableValue(spravkaData.submissionDate),
    stateNumberSubmissionDate: toPrintableValue(spravkaData.stateNumberSubmissionDate),
    fullName: null,
    note: toPrintableValue(spravkaData.note),
    model: toPrintableValue(techPassportData.model),
    yearOfManufacture: toPrintableValue(techPassportData.yearOfManufacture),
    color: toPrintableValue(techPassportData.color),
    vin: toPrintableValue(techPassportData.vin),
    chassisNumber: toPrintableValue(techPassportData.chassisNumber),
    bodyType: toPrintableValue(techPassportData.bodyType),
    seatCount: toPrintableValue(techPassportData.seatCount),
    fuelType: toPrintableValue(techPassportData.fuelType),
    registrationNumber: toPrintableValue(techPassportData.registrationNumber),
    vid: toPrintableValue(techPassportData.vid),
    owner: toPrintableValue(techPassportData.owner),
    personalNumber: toPrintableValue(techPassportData.personalNumber),
    ownerAddress: toPrintableValue(techPassportData.ownerAddress),
    issuingAuthority: toPrintableValue(techPassportData.issuingAuthority),
    authorizedSignature: toPrintableValue(techPassportData.authorizedSignature),
    engineCapacity: toPrintableValue(techPassportData.engineCapacity),
    enginePower: toPrintableValue(techPassportData.enginePower),
    unladenMass: toPrintableValue(techPassportData.unladenMass),
    maxPermissibleMass: toPrintableValue(techPassportData.maxPermissibleMass),
  });

  const handlePrintTechPassport = async () => {
    const printContent = document.getElementById("registration-print-passport");
    if (!printContent) {
      throw new Error("Не найден шаблон печати техпаспорта");
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

    const pdfPath = await window.electron.openPDFPreview(html);
    await window.electron.printGeneratedPDF(pdfPath);
  };

  const handleSubmit = async (printAfterSave = false) => {
    try {
      const rawDataToSend = {
        ...spravkaData,
        ...techPassportData,
        fullName: "",
      };
      const dataToSend = Object.fromEntries(
        Object.entries(rawDataToSend).map(([key, value]) => [key, toPrintableValue(value)]),
      );
      await window.electron.addRegistration(dataToSend);

      let printErrorHappened = false;
      if (printAfterSave) {
        try {
          await handlePrintTechPassport();
        } catch (printError) {
          printErrorHappened = true;
          console.error("Ошибка печати техпаспорта:", printError);
        }
      }

      setNotification({
        open: true,
        message: printErrorHappened
          ? "Данные сохранены, но печать техпаспорта не удалась."
          : "Данные успешно сохранены!",
        severity: printErrorHappened ? "error" : "success",
      });
      setSpravkaData(defaultSpravka);
      setTechPassportData(defaultTechPassport);
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setNotification({
        open: true,
        message: err instanceof Error ? err.message : "Ошибка при сохранении данных.",
        severity: "error",
      });
    }
  };

  const renderTextField = (label: string, field: string) => (
    <TextField
      label={label}
      value={getFieldValue(field)}
      onChange={(e) => handleChange(field, e.target.value)}
      fullWidth
      sx={{ mb: 2 }}
    />
  );

  const renderAuthorityField = (label: string, field: string) => (
    <Autocomplete
      freeSolo
      options={authorityNames}
      value={getFieldValue(field)}
      onChange={(_, newValue) => {
        handleChange(field, typeof newValue === "string" ? newValue : "");
      }}
      onInputChange={(_, newInputValue) => {
        handleChange(field, newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label={label} fullWidth sx={{ mb: 2 }} />}
    />
  );

  const renderSimpleDirectoryField = (
    label: string,
    field: keyof SpravkaProps,
    options: string[],
    helperText?: string,
  ) => (
    <Autocomplete
      freeSolo
      options={options}
      value={spravkaData[field]}
      onChange={(_, newValue) => {
        handleChange(field, typeof newValue === "string" ? newValue : "");
      }}
      onInputChange={(_, newInputValue) => {
        handleChange(field, newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          sx={{ mb: 2 }}
          helperText={helperText}
        />
      )}
    />
  );

  const renderSubdivisionField = () => (
    <Autocomplete
      freeSolo
      options={subdivisionOptions}
      value={spravkaData.subdivision}
      onChange={(_, newValue) => {
        handleChange("subdivision", typeof newValue === "string" ? newValue : "");
      }}
      onInputChange={(_, newInputValue) => {
        handleChange("subdivision", newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Подразделение"
          fullWidth
          sx={{ mb: 2 }}
          helperText={
            selectedOrganization
              ? "Можно выбрать из списка или ввести вручную"
              : "Ручной ввод или сначала выберите орган для списка подразделений"
          }
        />
      )}
    />
  );

  const renderDateField = (label: string, field: keyof SpravkaProps) => (
    <TextField
      label={label}
      type="date"
      value={spravkaData[field]}
      onChange={(e) => handleChange(field as string, e.target.value)}
      fullWidth
      sx={{ mb: 2 }}
      InputLabelProps={{ shrink: true }}
    />
  );

  const techPassportPrintData = buildTechPassportPrintData();

  return (
    <Box className="page-shell" sx={{ maxWidth: 880 }}>
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
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Регистрация автомобиля
        </Typography>

        {/* Spravka Fields */}
        {renderSimpleDirectoryField(
          "Тип регистрации",
          "registrationType",
          registrationTypeOptions,
          "Можно выбрать из справочника или ввести вручную",
        )}
        {renderDateField("Дата регистрации", "registrationDate")}
        {renderDateField("Дата получения", "receiveDate")}
        {renderTextField("Территориальный отдел", "territorialDepartment")}
        {renderAuthorityField("Наименование органа", "organizationName")}
        {renderSubdivisionField()}
        {renderSimpleDirectoryField(
          "Район",
          "district",
          districtOptions,
          "Можно выбрать из справочника или ввести вручную",
        )}
        {renderTextField("Адрес органа", "address")}
        {renderTextField("Гос номер", "stateNumber")}
        {renderTextField("Номер техпаспорта", "techPassportNumber")}
        {renderDateField("Срок окончания", "expirationDate")}
        {renderDateField("Дата сдачи техпаспорта", "submissionDate")}
        {renderDateField("Дата сдачи гос номера", "stateNumberSubmissionDate")}
        {renderTextField("Примечание", "note")}

        {/* Tech Passport Fields */}
        {renderTextField("Модель", "model")}
        {renderTextField("Адрес собственника", "ownerAddress")}
        {renderAuthorityField("Орган выдачи", "issuingAuthority")}
        {renderTextField("Подпись уполномоченного", "authorizedSignature")}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Назад
          </Button>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={() => void handleSubmit(true)}>
              Сохранить и печать техпаспорта
            </Button>
            <Button variant="contained" onClick={() => void handleSubmit(false)}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Paper>

      <div
        id="registration-print-passport"
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
        <TechPassportPrint searchResult={techPassportPrintData} />
      </div>

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

export default RegistrationForm;
