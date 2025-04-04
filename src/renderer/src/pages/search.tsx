import { useState } from "react";
import { Link } from "react-router-dom"; 
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from "@mui/material";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SearchResult {
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

type RegistrationType = 'primary' | 'replacement_number_and_tech_passport' | 'replacement_number_only' | 'replacement_tech_passport_only';
type TerritorialDepartment = 'bishkek' | 'osh';
type Organization = 'mvd' | 'gknb';

const Search = () => {
  const [searchType, setSearchType] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setError(null);
      if (!searchQuery.trim()) {
        setError("Введите номер для поиска");
        return;
      }

      const searchBy = searchType === 0 ? "stateNumber" : "techPassportNumber";
      const result = await window.electron.searchVehicle({ 
        type: searchBy, 
        query: searchQuery 
      });

      if (!result) {
        setError("Ничего не найдено");
        setSearchResult(null);
        return;
      }

      setSearchResult(result);
    } catch (err) {
      setError("Произошла ошибка при поиске");
      console.error(err);
    }
  };

  const generatePDF = async () => {
    if (!searchResult) return;

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });

    const translations = {
      territorialDepartment: {
        bishkek: "г. Бишкек",
        osh: "г. Ош"
      } as const,
      organization: {
        mvd: "МВД",
        gknb: "ГКНБ"
      } as const,
      registrationType: {
        primary: "Первичная",
        replacement_number_and_tech_passport: "Замена гос номера и техпаспорта",
        replacement_number_only: "Замена гос номера без замены техпаспорта",
        replacement_tech_passport_only: "Замена тех паспорта без замены гос номера"
      } as const
    };

    const tableData = [
      ["Тип регистрации", translations.registrationType[searchResult.registrationType as RegistrationType] || searchResult.registrationType],
      ["Дата регистрации", searchResult.registrationDate],
      ["Дата получения", searchResult.receiveDate],
      ["Территориальный отдел", translations.territorialDepartment[searchResult.territorialDepartment as TerritorialDepartment] || searchResult.territorialDepartment],
      ["Район", searchResult.district],
      ["Наименование органа", translations.organization[searchResult.organizationName as Organization] || searchResult.organizationName],
      ["Подразделение", searchResult.subdivision],
      ["Адрес", searchResult.address],
      ["Гос. номер", searchResult.stateNumber],
      ["Номер техпаспорта", searchResult.techPassportNumber],
      ["Срок окончания", searchResult.expirationDate],
      ["Дата сдачи", searchResult.submissionDate],
      ["Дата сдачи гос. номера", searchResult.stateNumberSubmissionDate],
      ["ФИО", searchResult.fullName],
      ["Примечание", searchResult.note]
    ];

    try {
      pdf.setFontSize(16);
      pdf.text("СПРАВКА", pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" });

      pdf.setFontSize(12);
      const today = new Date().toLocaleDateString('ru-RU');
      pdf.text(`Дата: ${today}`, 20, 30);

      const startY = 40;
      const margin = 20;
      const cellPadding = 5;
      const fontSize = 10;
      pdf.setFontSize(fontSize);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const col1Width = 70;
      const col2Width = pageWidth - (2 * margin) - col1Width;

      let currentY = startY;
      tableData.forEach(([label, value]) => {
        if (currentY > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          currentY = startY;
        }

        pdf.rect(margin, currentY, col1Width, 10);
        pdf.rect(margin + col1Width, currentY, col2Width, 10);

        pdf.text(encodeURIComponent(String(label)), margin + cellPadding, currentY + 7);
        pdf.text(encodeURIComponent(String(value || '')), margin + col1Width + cellPadding, currentY + 7);

        currentY += 10;
      });

      currentY += 20;
      pdf.text(encodeURIComponent("Подпись ответственного лица: _________________"), margin, currentY);

      pdf.save('справка.pdf');
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Ошибка при создании PDF');
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "100%", margin: "0 auto" }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        position: "absolute",
        top: 20,
        width: "100%"
      }}>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Поиск
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/" 
          sx={{ 
            minWidth: "120px",
            backgroundColor: "primary.main"
          }}
        >
          Назад
        </Button>
      </Box>

      <Paper sx={{ p: 3, mt: 10 }}>
        <Tabs 
          value={searchType} 
          onChange={(_, newValue) => setSearchType(newValue)}
          sx={{ mb: 3 }}
        >
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
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{ minWidth: "120px", height: "56px" }}
          >
            Поиск
          </Button>
        </Box>
      </Paper>

      {searchResult && (
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                      Параметр
                    </TableCell>
                    <TableCell sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                      Значение
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(searchResult).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generatePDF}
                sx={{ minWidth: "200px" }}
              >
                Распечатать справку
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Search;
