import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

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

interface ReportData {
  summaryByAuthorities: Array<{
    authorityName: string;
    issuedCount: number;
  }>;
  summaryBySubdivisions: Array<{
    subdivisionName: string;
    issuedCount: number;
  }>;
  details: Array<{
    stateNumber: string;
    techPassportNumber: string | null;
  }>;
}

type ReportSelectorOption =
  | {
    key: string;
    label: string;
    scope: "authority";
    authorityName: string;
  }
  | {
    key: string;
    label: string;
    scope: "subdivision";
    subdivisionName: string;
  };

const EMPTY_REPORT: ReportData = {
  summaryByAuthorities: [],
  summaryBySubdivisions: [],
  details: [],
};

const Reports = () => {
  const [directory, setDirectory] = useState<AuthorityDirectoryItem[]>([]);
  const [selectedOptionKey, setSelectedOptionKey] = useState("");
  const [report, setReport] = useState<ReportData>(EMPTY_REPORT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectorOptions = useMemo<ReportSelectorOption[]>(() => {
    const authorityNames = new Set<string>();
    const subdivisionNames = new Set<string>();

    for (const authority of directory) {
      const normalizedAuthority = authority.name.trim();
      if (normalizedAuthority) {
        authorityNames.add(normalizedAuthority);
      }

      for (const subdivision of authority.subdivisions) {
        const normalizedSubdivision = subdivision.name.trim();
        if (normalizedSubdivision) {
          subdivisionNames.add(normalizedSubdivision);
        }
      }
    }

    const options: ReportSelectorOption[] = [
      ...Array.from(authorityNames)
        .sort((a, b) => a.localeCompare(b, "ru"))
        .map((authorityName) => ({
          key: `authority:${authorityName}`,
          label: `Госорган: ${authorityName}`,
          scope: "authority" as const,
          authorityName,
        })),
      ...Array.from(subdivisionNames)
        .sort((a, b) => a.localeCompare(b, "ru"))
        .map((subdivisionName) => ({
          key: `subdivision:${subdivisionName}`,
          label: `Подразделение: ${subdivisionName}`,
          scope: "subdivision" as const,
          subdivisionName,
        })),
    ];

    return options;
  }, [directory]);

  const selectedOption = useMemo(
    () => selectorOptions.find((option) => option.key === selectedOptionKey) ?? null,
    [selectedOptionKey, selectorOptions],
  );

  useEffect(() => {
    const loadDirectory = async () => {
      try {
        const result = await window.electron.getAuthorityDirectory();
        setDirectory(result);
      } catch (loadError) {
        console.error("Ошибка загрузки справочника для отчета:", loadError);
        setError("Не удалось загрузить справочник госорганов и подразделений.");
      }
    };

    void loadDirectory();
  }, []);

  useEffect(() => {
    if (selectorOptions.length === 0) {
      if (selectedOptionKey !== "") {
        setSelectedOptionKey("");
      }
      return;
    }

    if (!selectedOption) {
      setSelectedOptionKey(selectorOptions[0].key);
    }
  }, [selectedOption, selectedOptionKey, selectorOptions]);

  useEffect(() => {
    if (selectorOptions.length > 0 && !selectedOption) {
      return;
    }

    const loadReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const filter = selectedOption
          ? selectedOption.scope === "authority"
            ? { scope: "authority" as const, authorityName: selectedOption.authorityName }
            : {
              scope: "subdivision" as const,
              subdivisionName: selectedOption.subdivisionName,
            }
          : null;

        const result = await window.electron.getIssuedNumbersReport(filter);
        setReport(result);
      } catch (loadError) {
        console.error("Ошибка формирования отчета:", loadError);
        setReport(EMPTY_REPORT);
        setError("Не удалось сформировать отчет.");
      } finally {
        setLoading(false);
      }
    };

    void loadReport();
  }, [selectedOption, selectorOptions.length]);

  return (
    <Box className="page-shell">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Отчеты</Typography>
        <Button component={Link} to="/" variant="outlined">
          Назад
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #d8e1ef",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Выбор органа или подразделения
        </Typography>
        <Autocomplete
          options={selectorOptions}
          value={selectedOption}
          onChange={(_, newValue) => setSelectedOptionKey(newValue?.key ?? "")}
          isOptionEqualToValue={(option, value) => option.key === value.key}
          getOptionLabel={(option) => option.label}
          noOptionsText="Справочник пуст"
          renderInput={(params) => <TextField {...params} label="Орган / подразделение" />}
        />
      </Paper>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, mb: 3 }}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid #d8e1ef",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            По органам
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Госорган</TableCell>
                  <TableCell align="right">Выдано номеров</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.summaryByAuthorities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>Нет данных</TableCell>
                  </TableRow>
                ) : (
                  report.summaryByAuthorities.map((row, index) => (
                    <TableRow key={`${row.authorityName}-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.authorityName}</TableCell>
                      <TableCell align="right">{row.issuedCount}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid #d8e1ef",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            По подразделениям
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Подразделение</TableCell>
                  <TableCell align="right">Выдано номеров</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.summaryBySubdivisions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>Нет данных</TableCell>
                  </TableRow>
                ) : (
                  report.summaryBySubdivisions.map((row, index) => (
                    <TableRow key={`${row.subdivisionName}-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.subdivisionName}</TableCell>
                      <TableCell align="right">{row.issuedCount}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid #d8e1ef",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle1">
            {selectedOption
              ? `Выданные номера: ${selectedOption.label}`
              : "Выданные номера"}
          </Typography>
          {loading ? <CircularProgress size={20} /> : null}
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Гос. номер</TableCell>
                <TableCell>Номер техпаспорта</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>Для выбранного фильтра нет выданных номеров</TableCell>
                </TableRow>
              ) : (
                report.details.map((row, index) => (
                  <TableRow key={`${row.stateNumber}-${row.techPassportNumber ?? "no-tech-passport"}-${index}`}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.stateNumber}</TableCell>
                    <TableCell>{row.techPassportNumber || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Reports;
