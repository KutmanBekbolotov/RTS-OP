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
  model: "ОП",
  yearOfManufacture: "-----",
  color: "-----",
  vin: "-----",
  chassisNumber: "-----",
  bodyType: "-----",
  seatCount: "-----",
  fuelType: "-----",
  engineCapacity: "-----",
  enginePower: "-----",
  unladenMass: "-----",
  maxPermissibleMass: "-----",
  registrationNumber: "-----",
  vid: "-----",
  owner: "-----",
  personalNumber: "-----",
  ownerAddress: "-----",
  issuingAuthority: "-----",
  authorizedSignature: "-----",
};

export type SearchResult = {
  stateNumber: string;
  techPassportNumber: string;
  registrationType: string;
  registrationDate: string;
  receiveDate: string;
  territorialDepartment: string;
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
        model: formData.model || "",
        yearOfManufacture: formData.yearOfManufacture || "",
        color: formData.color || "",
        vin: formData.vin || "",
        chassisNumber: formData.chassisNumber || "",
        bodyType: formData.bodyType || "",
        seatCount: formData.seatCount || "",
        fuelType: formData.fuelType || "",
        engineCapacity: formData.engineCapacity || "",
        enginePower: formData.enginePower || "",
        unladenMass: formData.unladenMass || "",
        maxPermissibleMass: formData.maxPermissibleMass || "",
        registrationNumber: formData.registrationNumber || "",
        vid: formData.vid || "",
        owner: formData.owner || "",
        personalNumber: formData.personalNumber || "",
        ownerAddress: formData.ownerAddress || "",
        issuingAuthority: formData.issuingAuthority || "",
        authorizedSignature: formData.authorizedSignature || "",
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

      {/* Дополнительные поля */}
      <TextField
        label="Модель"
        value={formData.model}
        onChange={(e) => handleChange("model", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Год выпуска"
        value={formData.yearOfManufacture}
        onChange={(e) => handleChange("yearOfManufacture", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Цвет"
        value={formData.color}
        onChange={(e) => handleChange("color", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="VIN"
        value={formData.vin}
        onChange={(e) => handleChange("vin", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Номер шасси"
        value={formData.chassisNumber}
        onChange={(e) => handleChange("chassisNumber", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Тип кузова"
        value={formData.bodyType}
        onChange={(e) => handleChange("bodyType", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Количество мест"
        value={formData.seatCount}
        onChange={(e) => handleChange("seatCount", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Тип топлива"
        value={formData.fuelType}
        onChange={(e) => handleChange("fuelType", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Объем двигателя"
        value={formData.engineCapacity}
        onChange={(e) => handleChange("engineCapacity", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Мощность двигателя"
        value={formData.enginePower}
        onChange={(e) => handleChange("enginePower", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Масса без нагрузки"
        value={formData.unladenMass}
        onChange={(e) => handleChange("unladenMass", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Макс. разрешенная масса"
        value={formData.maxPermissibleMass}
        onChange={(e) => handleChange("maxPermissibleMass", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Регистрационный номер"
        value={formData.registrationNumber}
        onChange={(e) => handleChange("registrationNumber", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="VID"
        value={formData.vid}
        onChange={(e) => handleChange("vid", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Владелец"
        value={formData.owner}
        onChange={(e) => handleChange("owner", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Личный номер"
        value={formData.personalNumber}
        onChange={(e) => handleChange("personalNumber", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Адрес владельца"
        value={formData.ownerAddress}
        onChange={(e) => handleChange("ownerAddress", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Выдавший орган"
        value={formData.issuingAuthority}
        onChange={(e) => handleChange("issuingAuthority", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Авторизованная подпись"
        value={formData.authorizedSignature}
        onChange={(e) => handleChange("authorizedSignature", e.target.value)}
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
