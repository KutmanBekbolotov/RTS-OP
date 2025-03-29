import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const openDatabase = async () => {
  return open({
    filename: 'registration.db',
    driver: sqlite3.Database
  });
};

export const createTable = async () => {
  const db = await openDatabase();
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

export const insertRegistrationData = async (formData: any) => {
  const db = await openDatabase();
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