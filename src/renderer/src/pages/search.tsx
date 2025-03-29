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

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Поиск
      </Typography>
      
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" component={Link} to="/" sx={{ mb: 2 }}>Назад</Button>
      </Box>

      <Tabs 
        value={searchType} 
        onChange={(_, newValue) => setSearchType(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Поиск по гос. номеру" />
        <Tab label="Поиск по номеру техпаспорта" />
      </Tabs>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label={searchType === 0 ? "Гос. номер" : "Номер техпаспорта"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          sx={{ minWidth: "120px" }}
        >
          Поиск
        </Button>
      </Box>

      {searchResult && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Параметр</TableCell>
                <TableCell>Значение</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Тип регистрации</TableCell>
                <TableCell>{searchResult.registrationType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Дата регистрации</TableCell>
                <TableCell>{searchResult.registrationDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Дата получения</TableCell>
                <TableCell>{searchResult.receiveDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Территориальный отдел</TableCell>
                <TableCell>{searchResult.territorialDepartment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Район</TableCell>
                <TableCell>{searchResult.district}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Наименование органа</TableCell>
                <TableCell>{searchResult.organizationName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Подразделение</TableCell>
                <TableCell>{searchResult.subdivision}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Адрес</TableCell>
                <TableCell>{searchResult.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Гос. номер</TableCell>
                <TableCell>{searchResult.stateNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Номер техпаспорта</TableCell>
                <TableCell>{searchResult.techPassportNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Срок окончания</TableCell>
                <TableCell>{searchResult.expirationDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Дата сдачи</TableCell>
                <TableCell>{searchResult.submissionDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Дата сдачи гос. номера</TableCell>
                <TableCell>{searchResult.stateNumberSubmissionDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ФИО</TableCell>
                <TableCell>{searchResult.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Примечание</TableCell>
                <TableCell>{searchResult.note}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Search;
