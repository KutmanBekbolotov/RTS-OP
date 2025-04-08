"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const database_2 = require("./database");
let mainWindow;
const PASSWORD = "123";
const createWindow = () => {
    const MAIN_PATH = path_1.default.join(__dirname, "..");
    const preloadPath = path_1.default.join(MAIN_PATH, "main", "preload.js");
    console.log("Preload path:", preloadPath);
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
    });
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-finish-load", () => {
        console.log("Window loaded");
        mainWindow.webContents.executeJavaScript('console.log("electron api:", window.electron)');
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};
// Добавляем проверку пароля
electron_1.ipcMain.handle("check-password", async (_event, inputPassword) => {
    return inputPassword === PASSWORD;
});
(async () => {
    try {
        await (0, database_1.createTable)();
        console.log("База данных инициализирована");
    }
    catch (error) {
        console.error("Ошибка при инициализации БД:", error);
    }
})();
electron_1.app.whenReady().then(createWindow);
electron_1.ipcMain.handle("insert-registration-data", async (event, formData) => {
    try {
        if (!formData) {
            throw new Error("Нет данных для сохранения");
        }
        console.log("Получены данные для сохранения:", formData);
        const result = await (0, database_1.insertRegistrationData)(formData);
        console.log("Данные сохранены:", result);
        return { success: true, message: "Данные успешно сохранены!" };
    }
    catch (error) {
        console.error("Ошибка при сохранении:", error);
        throw new Error(error instanceof Error ? error.message : "Ошибка при сохранении данных");
    }
});
// ipcMain.handle("search-vehicle", async (_, searchParams: { type: string; query: string }) => {
//   try {
//     const db = await openDatabase();
//     const { type, query } = searchParams;
//     const result = await db.get(`SELECT * FROM registrations WHERE ${type} = ?`, [query]);
//     console.log(`Searching for ${type} with query: ${query}`);
//     return result;
//   } catch (error) {
//     console.error("Error searching vehicle:", error);
//     throw error;
//   }
// });
electron_1.ipcMain.handle("search-vehicle", async (_, searchParams) => {
    try {
        const db = await (0, database_2.openDatabase)();
        const { type, query } = searchParams;
        // Логируем параметры
        console.log(`Searching for ${type} with query: ${query}`);
        // Проверим, что тип и запрос существуют
        if (!type || !query) {
            console.log("Invalid search parameters:", { type, query });
            return { error: "Invalid search parameters" };
        }
        // Логируем SQL-запрос
        const queryStr = `SELECT * FROM registrations WHERE ${type} = ?`;
        console.log("Executing query:", queryStr);
        const result = await db.get(queryStr, [query]);
        if (result) {
            console.log("Search result:", result);
            return result;
        }
        else {
            console.log("No results found for the query.");
            return { error: "No results found" };
        }
    }
    catch (error) {
        console.error("Error searching vehicle:", error);
        throw error;
    }
});
