import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { app } from 'electron';
import path from 'path';

export interface Authority {
  id: number;
  name: string;
}

export interface Subdivision {
  id: number;
  authorityId: number;
  name: string;
}

export interface AuthorityDirectoryItem extends Authority {
  subdivisions: Subdivision[];
}

export const openDatabase = async () => {
  const dbPath = path.join(app.getPath('userData'), 'registration.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  await db.exec("PRAGMA foreign_keys = ON");
  return db;
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

    await db.exec(`
      CREATE TABLE IF NOT EXISTS authorities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS authority_subdivisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        authorityId INTEGER NOT NULL,
        name TEXT NOT NULL COLLATE NOCASE,
        UNIQUE(authorityId, name),
        FOREIGN KEY(authorityId) REFERENCES authorities(id) ON DELETE CASCADE
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

export const getAuthorities = async (): Promise<Authority[]> => {
  const db = await openDatabase();
  try {
    const rows = await db.all<Authority[]>(
      `SELECT id, name FROM authorities ORDER BY name COLLATE NOCASE`,
    );
    return rows;
  } finally {
    await db.close();
  }
};

export const addAuthority = async (name: string): Promise<Authority> => {
  const db = await openDatabase();
  try {
    const result = await db.run(
      `INSERT INTO authorities (name) VALUES (?)`,
      [name],
    );

    const row = await db.get<Authority>(
      `SELECT id, name FROM authorities WHERE id = ?`,
      [result.lastID],
    );

    if (!row) {
      throw new Error("Не удалось получить добавленный госорган");
    }

    return row;
  } finally {
    await db.close();
  }
};

export const deleteAuthority = async (id: number): Promise<void> => {
  const db = await openDatabase();
  try {
    await db.run(`DELETE FROM authorities WHERE id = ?`, [id]);
  } finally {
    await db.close();
  }
};

export const getAuthorityDirectory = async (): Promise<AuthorityDirectoryItem[]> => {
  const db = await openDatabase();
  try {
    const authorities = await db.all<Authority[]>(
      `SELECT id, name FROM authorities ORDER BY name COLLATE NOCASE`,
    );
    const subdivisions = await db.all<Subdivision[]>(
      `SELECT id, authorityId, name
       FROM authority_subdivisions
       ORDER BY name COLLATE NOCASE`,
    );

    const subdivisionsByAuthority = new Map<number, Subdivision[]>();
    for (const subdivision of subdivisions) {
      const bucket = subdivisionsByAuthority.get(subdivision.authorityId) ?? [];
      bucket.push(subdivision);
      subdivisionsByAuthority.set(subdivision.authorityId, bucket);
    }

    return authorities.map((authority) => ({
      ...authority,
      subdivisions: subdivisionsByAuthority.get(authority.id) ?? [],
    }));
  } finally {
    await db.close();
  }
};

export const addSubdivision = async (authorityId: number, name: string): Promise<Subdivision> => {
  const db = await openDatabase();
  try {
    const result = await db.run(
      `INSERT INTO authority_subdivisions (authorityId, name) VALUES (?, ?)`,
      [authorityId, name],
    );

    const row = await db.get<Subdivision>(
      `SELECT id, authorityId, name
       FROM authority_subdivisions
       WHERE id = ?`,
      [result.lastID],
    );

    if (!row) {
      throw new Error("Не удалось получить добавленное подразделение");
    }

    return row;
  } finally {
    await db.close();
  }
};

export const deleteSubdivision = async (id: number): Promise<void> => {
  const db = await openDatabase();
  try {
    await db.run(`DELETE FROM authority_subdivisions WHERE id = ?`, [id]);
  } finally {
    await db.close();
  }
};
