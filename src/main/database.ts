import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Открытие базы данных
export const openDatabase = async () => {
  return open({
    filename: 'registration.db',
    driver: sqlite3.Database,
  });
};

// Функция для создания таблицы
export const createTable = async () => {
  const db = await openDatabase();
  try {
    // Удаляем старую таблицу, если она существует, и создаем новую
    await db.exec('DROP TABLE IF EXISTS registrations');
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
  }
};

// Функция для вставки данных регистрации
export const insertRegistrationData = async (formData: any) => {
  const db = await openDatabase();
  
  // Убедитесь, что все обязательные данные присутствуют
  const requiredFields = [
    'registrationType', 'registrationDate', 'receiveDate', 'territorialDepartment', 
    'organizationName', 'subdivision', 'address', 'stateNumber', 
    'techPassportNumber', 'expirationDate', 'submissionDate', 'stateNumberSubmissionDate', 
    'fullName', 'note', 'model', 'yearOfManufacture', 'color', 'vin', 'chassisNumber', 
    'bodyType', 'seatCount', 'fuelType', 'engineCapacity', 'enginePower', 'unladenMass', 
    'maxPermissibleMass', 'registrationNumber', 'vid', 'owner', 'personalNumber', 
    'ownerAddress', 'issuingAuthority', 'authorizedSignature'
  ];

  // Проверяем, что все обязательные поля присутствуют
  for (const field of requiredFields) {
    if (!(field in formData)) {
      throw new Error(`Отсутствует обязательное поле: ${field}`);
    }
  }

  // Формируем запрос на вставку данных
  const placeholders = requiredFields.map(() => '?').join(', ');
  const values = requiredFields.map(field => formData[field]);

  try {
    const result = await db.run(`
      INSERT INTO registrations (
        registrationType, registrationDate, receiveDate, territorialDepartment, 
        organizationName, subdivision, address, stateNumber, techPassportNumber, 
        expirationDate, submissionDate, stateNumberSubmissionDate, fullName, note, 
        model, yearOfManufacture, color, vin, chassisNumber, bodyType, seatCount, 
        fuelType, engineCapacity, enginePower, unladenMass, maxPermissibleMass, 
        registrationNumber, vid, owner, personalNumber, ownerAddress, issuingAuthority, 
        authorizedSignature
      ) 
      VALUES (${placeholders})
    `, values);

    console.log("Данные успешно вставлены в базу данных");
    return result;
  } catch (error) {
    console.error("Ошибка при вставке данных:", error);
    throw error;
  }
};
