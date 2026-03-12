import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box, Typography, Snackbar, Alert, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface SpravkaProps {
  registrationType: string;
  registrationDate: string;
  receiveDate: string;
  territorialDepartment: string;
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

const defaultSpravka: SpravkaProps = {
  registrationType: "",
  registrationDate: "",
  receiveDate: "",
  territorialDepartment: "ГЦ РТСВС",
  organizationName: "",
  subdivision: "",
  address: "",
  stateNumber: "",
  techPassportNumber: "",
  expirationDate: "",
  submissionDate: "",
  stateNumberSubmissionDate: "",
  fullName: "",
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
    const loadAuthorityDirectory = async () => {
      try {
        const result = await window.electron.getAuthorityDirectory();
        setAuthorityDirectory(result);
      } catch (error) {
        console.error("Ошибка загрузки справочника госорганов:", error);
      }
    };

    void loadAuthorityDirectory();
  }, []);

  const normalizeName = (value: string) => value.trim().toLowerCase();

  const authorityNames = authorityDirectory.map((item) => item.name);

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

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...spravkaData,
        ...techPassportData,
        registrationDate: spravkaData.registrationDate || null,
        receiveDate: spravkaData.receiveDate || null,
        expirationDate: spravkaData.expirationDate || null,
        submissionDate: spravkaData.submissionDate || null,
        stateNumberSubmissionDate: spravkaData.stateNumberSubmissionDate || null,
      };
      // console.log('Data to send:', dataToSend);

      await window.electron.addRegistration(dataToSend);
      setNotification({
        open: true,
        message: "Данные успешно сохранены!",
        severity: "success",
      });
      setSpravkaData(defaultSpravka);
      setTechPassportData(defaultTechPassport);
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      setNotification({
        open: true,
        message: "Ошибка при сохранении данных.",
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
        {renderTextField("Тип регистрации", "registrationType")}
        {renderDateField("Дата регистрации", "registrationDate")}
        {renderDateField("Дата получения", "receiveDate")}
        {renderTextField("Территориальный отдел", "territorialDepartment")}
        {renderAuthorityField("Наименование органа", "organizationName")}
        {renderSubdivisionField()}
        {renderTextField("Адрес органа", "address")}
        {renderTextField("Гос номер", "stateNumber")}
        {renderTextField("Номер техпаспорта", "techPassportNumber")}
        {renderDateField("Срок окончания", "expirationDate")}
        {renderDateField("Дата сдачи техпаспорта", "submissionDate")}
        {renderDateField("Дата сдачи гос номера", "stateNumberSubmissionDate")}
        {renderTextField("ФИО", "fullName")}
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
          <Button variant="contained" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Box>
      </Paper>

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
