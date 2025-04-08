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
      
      // Справка
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
      note TEXT,

      // Техпаспорт
      model TEXT,
      yearOfManufacture TEXT,
      color TEXT,
      vin TEXT,
      chassisNumber TEXT,
      bodyType TEXT,
      seatCount TEXT,
      fuelType TEXT,
      engineCapacity TEXT,
      enginePower TEXT,
      unladenMass TEXT,
      maxPermissibleMass TEXT,
      registrationNumber TEXT,
      vid TEXT,
      owner TEXT,
      personalNumber TEXT,
      ownerAddress TEXT,
      issuingAuthority TEXT,
      authorizedSignature TEXT
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
      stateNumberSubmissionDate, fullName, note,
      
      model, yearOfManufacture, color, vin, chassisNumber,
      bodyType, seatCount, fuelType, engineCapacity, enginePower,
      unladenMass, maxPermissibleMass, registrationNumber, vid,
      owner, personalNumber, ownerAddress, issuingAuthority, authorizedSignature
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        formData.note,
        formData.model,
        formData.yearOfManufacture,
        formData.color,
        formData.vin,
        formData.chassisNumber,
        formData.bodyType,
        formData.seatCount,
        formData.fuelType,
        formData.engineCapacity,
        formData.enginePower,
        formData.unladenMass,
        formData.maxPermissibleMass,
        formData.registrationNumber,
        formData.vid,
        formData.owner,
        formData.personalNumber,
        formData.ownerAddress,
        formData.issuingAuthority,
        formData.authorizedSignature
    ]);
    return result;
};
exports.insertRegistrationData = insertRegistrationData;
