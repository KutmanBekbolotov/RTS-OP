import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const openDatabase = async () => {
  return open({
    filename: 'registration.db',
    driver: sqlite3.Database,
  });
};

export const createTable = async () => {
  const db = await openDatabase();
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        registrationType TEXT,
        registrationDate TEXT,
        receiveDate TEXT,
        territorialDepartment TEXT,
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
    console.log("Таблица успешно создана");
  } catch (error) {
    console.error("Ошибка при создании таблицы:", error);
    throw error;
  } finally {
    await db.close();
  }
};

export const insertRegistrationData = async (formData: any) => {
  const db = await openDatabase();
  try {
    const result = await db.run(`
      INSERT INTO registrations (
        registrationType, registrationDate, receiveDate, territorialDepartment,
        organizationName, subdivision, address, stateNumber,
        techPassportNumber, expirationDate, submissionDate,
        stateNumberSubmissionDate, fullName, note,
        model, yearOfManufacture, color, vin, chassisNumber,
        bodyType, seatCount, fuelType, engineCapacity, enginePower,
        unladenMass, maxPermissibleMass, registrationNumber, vid,
        owner, personalNumber, ownerAddress, issuingAuthority, authorizedSignature
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      formData.registrationType,
      formData.registrationDate,
      formData.receiveDate,
      formData.territorialDepartment,
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
      formData.authorizedSignature,
    ]);
    return result;
  } finally {
    await db.close();
  }
};
