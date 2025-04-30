import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
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

const defaultSpravka: SpravkaProps = {
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

const defaultTechPassport: TechPassportProps = {
  model: "ОП",
  yearOfManufacture: "—————",
  color: "—————",
  vin: "—————",
  chassisNumber: "—————",
  bodyType: "—————",
  seatCount: "—————",
  fuelType: "—————",
  engineCapacity: "—————",
  enginePower: "—————",
  unladenMass: "—————",
  maxPermissibleMass: "—————",
  registrationNumber: "—————",
  vid: "—————",
  owner: "—————",
  personalNumber: "-",
  ownerAddress: "",
  issuingAuthority: "",
  authorizedSignature: "",
};

const RegistrationForm = () => {
  const [spravkaData, setSpravkaData] = useState<SpravkaProps>(defaultSpravka);
  const [techPassportData, setTechPassportData] = useState<TechPassportProps>(defaultTechPassport);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    if (field in spravkaData) {
      setSpravkaData((prev) => ({ ...prev, [field]: value }));
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
      console.log('Data to send:', dataToSend);

      await window.electron.addRegistration(dataToSend);
      alert("Данные успешно сохранены!");
      setSpravkaData(defaultSpravka);
      setTechPassportData(defaultTechPassport);
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("Ошибка при сохранении данных.");
    }
  };

  const renderTextField = (label: string, field: string) => (
    <TextField
      label={label}
      value={field in spravkaData ? spravkaData[field as keyof SpravkaProps] : techPassportData[field as keyof TechPassportProps]}
      onChange={(e) => handleChange(field, e.target.value)}
      fullWidth
      sx={{ mb: 2 }}
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
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>Регистрация автомобиля</Typography>

      {/* Spravka Fields */}
      {renderTextField("Тип регистрации", "registrationType")}
      {renderDateField("Дата регистрации", "registrationDate")}
      {renderDateField("Дата получения", "receiveDate")}
      {renderTextField("Территориальный отдел", "territorialDepartment")}
      {renderTextField("Наименование органа", "organizationName")}
      {renderTextField("Подразделение", "subdivision")}
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
      {renderTextField("Год выпуска", "yearOfManufacture")}
      {renderTextField("Цвет", "color")}
      {renderTextField("VIN", "vin")}
      {renderTextField("№ кузова / шасси", "chassisNumber")}
      {renderTextField("Тип кузова", "bodyType")}
      {renderTextField("Кол-во мест", "seatCount")}
      {renderTextField("Тип топлива", "fuelType")}
      {renderTextField("Объём двигателя", "engineCapacity")}
      {renderTextField("Мощность двигателя", "enginePower")}
      {renderTextField("Масса без нагрузки", "unladenMass")}
      {renderTextField("Макс. масса", "maxPermissibleMass")}
      {renderTextField("Рег. номер", "registrationNumber")}
      {renderTextField("VID", "vid")}
      {renderTextField("Собственник", "owner")}
      {renderTextField("ПИН / ИСН", "personalNumber")}
      {renderTextField("Адрес собственника", "ownerAddress")}
      {renderTextField("Орган выдачи", "issuingAuthority")}
      {renderTextField("Подпись уполномоченного", "authorizedSignature")}

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