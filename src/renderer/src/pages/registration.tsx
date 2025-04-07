import { useState } from "react";
import {
  TextField, Button, Box, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface FormData {
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

export interface SearchResult {
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


const defaultForm: FormData = {
  registrationType: "",
  registrationDate: "",
  receiveDate: "",
  territorialDepartment: "",
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

const RegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const navigate = useNavigate();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        registrationDate: formData.registrationDate || null,
        receiveDate: formData.receiveDate || null,
        expirationDate: formData.expirationDate || null,
        submissionDate: formData.submissionDate || null,
        stateNumberSubmissionDate: formData.stateNumberSubmissionDate || null,
      };

      await window.electron.addRegistration(dataToSend);
      alert("Данные успешно сохранены!");
      setFormData(defaultForm);
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("Ошибка при сохранении данных.");
    }
  };

  const renderDateField = (label: string, field: keyof FormData) => (
    <TextField
      label={label}
      type="date"
      value={formData[field]}
      onChange={(e) => handleChange(field, e.target.value)}
      fullWidth
      sx={{ mb: 2 }}
      InputLabelProps={{ shrink: true }}
    />
  );

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>Регистрация автомобиля</Typography>

      <TextField
        label="Тип регистрации"
        value={formData.registrationType}
        onChange={(e) => handleChange("registrationType", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {renderDateField("Дата регистрации", "registrationDate")}
      {renderDateField("Дата получения", "receiveDate")}

      <TextField
        label="Территориальный отдел"
        value={formData.territorialDepartment}
        onChange={(e) => handleChange("territorialDepartment", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Наименование органа"
        value={formData.organizationName}
        onChange={(e) => handleChange("organizationName", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Подразделение"
        value={formData.subdivision}
        onChange={(e) => handleChange("subdivision", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Адрес органа"
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Гос номер"
        value={formData.stateNumber}
        onChange={(e) => handleChange("stateNumber", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Номер техпаспорта"
        value={formData.techPassportNumber}
        onChange={(e) => handleChange("techPassportNumber", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {renderDateField("Срок окончания", "expirationDate")}
      {renderDateField("Дата сдачи техпаспорта", "submissionDate")}
      {renderDateField("Дата сдачи гос номера", "stateNumberSubmissionDate")}

      <TextField
        label="ФИО"
        value={formData.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Примечание"
        value={formData.note}
        onChange={(e) => handleChange("note", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Назад
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Сохранить
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
