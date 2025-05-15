// components/CertificateContent.tsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { SearchResult } from "./types";

const translations = {
  registrationType: {
    primary: "Первичная",
    replacement_number_and_tech_passport: "Замена гос номера и техпаспорта",
    replacement_number_only: "Замена гос номера без замены техпаспорта",
    replacement_tech_passport_only: "Замена техпаспорта без замены гос номера",
  },
};

type Props = {
  data: SearchResult;
};

const CertificateContent: React.FC<Props> = ({ data }) => {
  const renderField = (label: string, value: string | null) => (
    <TableRow>
      <TableCell sx={{ border: "1px solid black", padding: "6px" }}>{label}</TableCell>
      <TableCell sx={{ border: "1px solid black", padding: "6px" }}>{value || "-"}</TableCell>
    </TableRow>
  );

  return (
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
                  data.registrationType as keyof typeof translations.registrationType
                ] || data.registrationType
              )}
              {renderField("Дата регистрации", data.registrationDate)}
              {renderField("Дата получения", data.receiveDate)}
              {renderField("Территориальный отдел", data.territorialDepartment)}
              {renderField("Наименование органа", data.organizationName)}
              {renderField("Подразделение", data.subdivision)}
              {renderField("Адрес", data.address)}
              {renderField("Гос. номер", data.stateNumber)}
              {renderField("Номер техпаспорта", data.techPassportNumber)}
              {renderField("Срок окончания", data.expirationDate)}
              {renderField("Дата сдачи", data.submissionDate)}
              {renderField("Дата сдачи гос. номера", data.stateNumberSubmissionDate)}
              {renderField("ФИО", data.fullName)}
              {renderField("Примечание", data.note)}
              {renderField("Объем двигателя", data.engineCapacity)}
              {renderField("Мощность двигателя", data.enginePower)}
              {renderField("Собственная масса", data.unladenMass)}
              {renderField("Макс. разрешенная масса", data.maxPermissibleMass)}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{ mt: 4, fontSize: "16px" }}>
          Подпись ответственного лица: _______________________
        </Typography>
      </Paper>
    </Box>
  );
};

export default CertificateContent;
