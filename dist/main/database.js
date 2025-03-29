"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertRegistrationData = exports.createTable = exports.openDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const openDatabase = async () => {
    return (0, sqlite_1.open)({
        filename: 'registration.db',
        driver: sqlite3_1.default.Database
    });
};
exports.openDatabase = openDatabase;
const createTable = async () => {
    const db = await (0, exports.openDatabase)();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registrationType TEXT,
      registrationDate TEXT,
      receiveDate TEXT,
      territorialDepartment TEXT,
      district TEXT,
      organizationName TEXT,
      subdivision TEXT,
      address TEXT,
      stateNumber TEXT UNIQUE,
      techPassportNumber TEXT UNIQUE,
      expirationDate TEXT,
      submissionDate TEXT,
      stateNumberSubmissionDate TEXT,
      fullName TEXT,
      note TEXT
    )
  `);
};
exports.createTable = createTable;
const insertRegistrationData = async (formData) => {
    const db = await (0, exports.openDatabase)();
    const result = await db.run(`
    INSERT INTO registrations (
      registrationType, registrationDate, receiveDate, territorialDepartment,
      district, organizationName, subdivision, address, stateNumber,
      techPassportNumber, expirationDate, submissionDate,
      stateNumberSubmissionDate, fullName, note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
        formData.registrationType,
        formData.registrationDate,
        formData.receiveDate,
        formData.territorialDepartment,
        formData.district,
        formData.organizationName,
        formData.subdivision,
        formData.address,
        formData.stateNumber,
        formData.techPassportNumber,
        formData.expirationDate,
        formData.submissionDate,
        formData.stateNumberSubmissionDate,
        formData.fullName,
        formData.note
    ]);
    return result;
};
exports.insertRegistrationData = insertRegistrationData;
