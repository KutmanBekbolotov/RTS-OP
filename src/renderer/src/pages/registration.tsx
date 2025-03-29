import { useState } from "react";
import { TextField, MenuItem, Button, Box, Typography, FormControl, InputLabel, Select } from "@mui/material";
import { Link } from "react-router-dom"; 

interface RegistrationFormData {
  registrationType: string;
  registrationDate: Date | null;
  receiveDate: Date | null;
  territorialDepartment: string;
  district: string;
  organizationName: string;
  subdivision: string;
  address: string;
  stateNumber: string;
  techPassportNumber: string;
  expirationDate: Date | null;
  submissionDate: Date | null;
  stateNumberSubmissionDate: Date | null;
  fullName: string;
  note: string;
}

const Registration = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    registrationType: "",
    registrationDate: null,
    receiveDate: null,
    territorialDepartment: "",
    district: "",
    organizationName: "",
    subdivision: "",
    address: "",
    stateNumber: "",
    techPassportNumber: "",
    expirationDate: null,
    submissionDate: null,
    stateNumberSubmissionDate: null,
    fullName: "",
    note: "",
  });

  const [districts, setDistricts] = useState<string[]>([]); 
  const [subdivisions, setSubdivisions] = useState<string[]>([]); 

  const organizations = {
    mvd: ["ГУВД г.Бишек", "Свердловское РОВД"],
    gknb: ["9-отдел", "АТЦ", "КЦКБ"]
  };

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (field === "territorialDepartment") {
      if (value === "bishkek") {
        setDistricts(["Центральный", "Советский", "Октябрьский", "Ленинский"]);
      } else if (value === "osh") {
        setDistricts(["Ош", "Араван", "Чон-Арык"]);
      } else {
        setDistricts([]); 
      }
    }

    if (field === "organizationName") {
      if (value === "mvd") {
        setSubdivisions(organizations.mvd);
      } else if (value === "gknb") {
        setSubdivisions(organizations.gknb);
      } else {
        setSubdivisions([]);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // Преобразуем даты в строки перед отправкой
      const dataToSend = {
        ...formData,
        registrationDate: formData.registrationDate?.toISOString().split('T')[0] || null,
        receiveDate: formData.receiveDate?.toISOString().split('T')[0] || null,
        expirationDate: formData.expirationDate?.toISOString().split('T')[0] || null,
        submissionDate: formData.submissionDate?.toISOString().split('T')[0] || null,
        stateNumberSubmissionDate: formData.stateNumberSubmissionDate?.toISOString().split('T')[0] || null,
      };

      await window.electron.addRegistration(dataToSend);
      alert("Данные успешно сохранены!");
      
      // Очищаем форму после успешного сохранения
      setFormData({
        registrationType: "",
        registrationDate: null,
        receiveDate: null,
        territorialDepartment: "",
        district: "",
        organizationName: "",
        subdivision: "",
        address: "",
        stateNumber: "",
        techPassportNumber: "",
        expirationDate: null,
        submissionDate: null,
        stateNumberSubmissionDate: null,
        fullName: "",
        note: "",
      });
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Ошибка при сохранении данных');
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Регистрация
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Тип регистрации</InputLabel>
        <Select
          value={formData.registrationType}
          onChange={(e) => handleChange("registrationType", e.target.value)}
        >
          <MenuItem value="primary">Первичная</MenuItem>
          <MenuItem value="replacement_number_and_tech_passport">Замена гос номера и техпаспорта</MenuItem>
          <MenuItem value="replacement_number_only">Замена гос номера без замены техпаспорта</MenuItem>
          <MenuItem value="replacement_tech_passport_only">Замена тех паспорта без замены гос номера</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Дата регистрации"
        type="date"
        value={formData.registrationDate ? formData.registrationDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleChange("registrationDate", new Date(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        label="Дата получения"
        type="date"
        value={formData.receiveDate ? formData.receiveDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleChange("receiveDate", new Date(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Территориальные отделы</InputLabel>
        <Select
          value={formData.territorialDepartment}
          onChange={(e) => handleChange("territorialDepartment", e.target.value)}
        >
          <MenuItem value="bishkek">г. Бишкек</MenuItem>
          <MenuItem value="osh">г. Ош</MenuItem>
          <MenuItem value="chui">Чуйская область</MenuItem>
          <MenuItem value="talas">Таласская область</MenuItem>
          <MenuItem value="issyk_kul">Иссык-кульская область</MenuItem>
          <MenuItem value="naryn">Нарынская область</MenuItem>
          <MenuItem value="jalal_abad">Джалал-Абадская область</MenuItem>
          <MenuItem value="osh_region">Ошская область</MenuItem>
          <MenuItem value="batken">Баткенская область</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Район</InputLabel>
        <Select
          value={formData.district}
          onChange={(e) => handleChange("district", e.target.value)}
          disabled={!formData.territorialDepartment}
        >
          {districts.map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Наименование органа</InputLabel>
        <Select
          value={formData.organizationName}
          onChange={(e) => handleChange("organizationName", e.target.value)}
        >
          <MenuItem value="mvd">МВД</MenuItem>
          <MenuItem value="gknb">ГКНБ</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Подразделение</InputLabel>
        <Select
          value={formData.subdivision}
          onChange={(e) => handleChange("subdivision", e.target.value)}
          disabled={!formData.organizationName}
        >
          {subdivisions.map((subdivision) => (
            <MenuItem key={subdivision} value={subdivision}>
              {subdivision}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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

      <TextField
        label="Срок оканчания"
        type="date"
        value={formData.expirationDate ? formData.expirationDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleChange("expirationDate", new Date(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        label="Дата о сдачи"
        type="date"
        value={formData.submissionDate ? formData.submissionDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleChange("submissionDate", new Date(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        label="Дата сдачи гос номера"
        type="date"
        value={formData.stateNumberSubmissionDate ? formData.stateNumberSubmissionDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleChange("stateNumberSubmissionDate", new Date(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

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

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" component={Link} to="/" sx={{ mb: 2 }}>Назад</Button>
        <Button variant="contained" onClick={handleSubmit}>Сохранить</Button>
      </Box>
    </Box>
  );
};

export default Registration;