"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubdivision = exports.addSubdivision = exports.getAuthorityDirectory = exports.deleteAuthority = exports.addAuthority = exports.getAuthorities = exports.updateRegistrationData = exports.insertRegistrationData = exports.createTable = exports.openDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const openDatabase = async () => {
    const dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'registration.db');
    const db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
    await db.exec("PRAGMA foreign_keys = ON");
    return db;
};
exports.openDatabase = openDatabase;
const createTable = async () => {
    const db = await (0, exports.openDatabase)();
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
    }
    catch (error) {
        console.error("Ошибка при создании таблицы:", error);
        throw error;
    }
    finally {
        await db.close();
    }
};
exports.createTable = createTable;
const insertRegistrationData = async (formData) => {
    const db = await (0, exports.openDatabase)();
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
    }
    finally {
        await db.close();
    }
};
exports.insertRegistrationData = insertRegistrationData;
const updateRegistrationData = async (formData) => {
    const db = await (0, exports.openDatabase)();
    try {
        const result = await db.run(`
      UPDATE registrations SET
        registrationType = ?,
        registrationDate = ?,
        receiveDate = ?,
        territorialDepartment = ?,
        organizationName = ?,
        subdivision = ?,
        address = ?,
        stateNumber = ?,
        techPassportNumber = ?,
        expirationDate = ?,
        submissionDate = ?,
        stateNumberSubmissionDate = ?,
        fullName = ?,
        note = ?,
        model = ?,
        yearOfManufacture = ?,
        color = ?,
        vin = ?,
        chassisNumber = ?,
        bodyType = ?,
        seatCount = ?,
        fuelType = ?,
        engineCapacity = ?,
        enginePower = ?,
        unladenMass = ?,
        maxPermissibleMass = ?,
        registrationNumber = ?,
        vid = ?,
        owner = ?,
        personalNumber = ?,
        ownerAddress = ?,
        issuingAuthority = ?,
        authorizedSignature = ?
      WHERE id = ?
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
            formData.id,
        ]);
        if (!result.changes) {
            throw new Error("Запись не найдена");
        }
        return db.get(`SELECT * FROM registrations WHERE id = ?`, [formData.id]);
    }
    finally {
        await db.close();
    }
};
exports.updateRegistrationData = updateRegistrationData;
const getAuthorities = async () => {
    const db = await (0, exports.openDatabase)();
    try {
        const rows = await db.all(`SELECT id, name FROM authorities ORDER BY name COLLATE NOCASE`);
        return rows;
    }
    finally {
        await db.close();
    }
};
exports.getAuthorities = getAuthorities;
const addAuthority = async (name) => {
    const db = await (0, exports.openDatabase)();
    try {
        const result = await db.run(`INSERT INTO authorities (name) VALUES (?)`, [name]);
        const row = await db.get(`SELECT id, name FROM authorities WHERE id = ?`, [result.lastID]);
        if (!row) {
            throw new Error("Не удалось получить добавленный госорган");
        }
        return row;
    }
    finally {
        await db.close();
    }
};
exports.addAuthority = addAuthority;
const deleteAuthority = async (id) => {
    const db = await (0, exports.openDatabase)();
    try {
        await db.run(`DELETE FROM authorities WHERE id = ?`, [id]);
    }
    finally {
        await db.close();
    }
};
exports.deleteAuthority = deleteAuthority;
const getAuthorityDirectory = async () => {
    const db = await (0, exports.openDatabase)();
    try {
        const authorities = await db.all(`SELECT id, name FROM authorities ORDER BY name COLLATE NOCASE`);
        const subdivisions = await db.all(`SELECT id, authorityId, name
       FROM authority_subdivisions
       ORDER BY name COLLATE NOCASE`);
        const subdivisionsByAuthority = new Map();
        for (const subdivision of subdivisions) {
            const bucket = subdivisionsByAuthority.get(subdivision.authorityId) ?? [];
            bucket.push(subdivision);
            subdivisionsByAuthority.set(subdivision.authorityId, bucket);
        }
        return authorities.map((authority) => ({
            ...authority,
            subdivisions: subdivisionsByAuthority.get(authority.id) ?? [],
        }));
    }
    finally {
        await db.close();
    }
};
exports.getAuthorityDirectory = getAuthorityDirectory;
const addSubdivision = async (authorityId, name) => {
    const db = await (0, exports.openDatabase)();
    try {
        const result = await db.run(`INSERT INTO authority_subdivisions (authorityId, name) VALUES (?, ?)`, [authorityId, name]);
        const row = await db.get(`SELECT id, authorityId, name
       FROM authority_subdivisions
       WHERE id = ?`, [result.lastID]);
        if (!row) {
            throw new Error("Не удалось получить добавленное подразделение");
        }
        return row;
    }
    finally {
        await db.close();
    }
};
exports.addSubdivision = addSubdivision;
const deleteSubdivision = async (id) => {
    const db = await (0, exports.openDatabase)();
    try {
        await db.run(`DELETE FROM authority_subdivisions WHERE id = ?`, [id]);
    }
    finally {
        await db.close();
    }
};
exports.deleteSubdivision = deleteSubdivision;
