"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
let printPreviewLib = null;
const getPrintPreviewLib = () => {
    if (!printPreviewLib) {
        printPreviewLib = require("electron-print-preview");
    }
    return printPreviewLib;
};
let mainWindow = null;
const PASSWORD = process.env.RTS_OP_PASSWORD ?? "123";
const ALLOWED_SEARCH_FIELDS = new Set(["stateNumber", "techPassportNumber"]);
const createWindow = async () => {
    const preloadPath = path_1.default.join(__dirname, "preload.js");
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
    const devServerUrl = process.env.ELECTRON_RENDERER_URL;
    if (devServerUrl) {
        await mainWindow.loadURL(devServerUrl);
        mainWindow.webContents.openDevTools();
    }
    else {
        const rendererCandidates = [
            path_1.default.join(__dirname, "../renderer/index.html"),
            path_1.default.join(process.cwd(), "dist/renderer/index.html"),
        ];
        const rendererEntry = rendererCandidates.find((candidate) => fs_1.default.existsSync(candidate));
        if (!rendererEntry) {
            throw new Error("Renderer entry point not found. Run `npm run build:renderer` or set ELECTRON_RENDERER_URL.");
        }
        await mainWindow.loadFile(rendererEntry);
    }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};
electron_1.ipcMain.handle("print-generated-pdf", async (_event, pdfPath) => {
    if (!fs_1.default.existsSync(pdfPath)) {
        throw new Error("PDF файл не найден");
    }
    if (process.platform === "win32") {
        const acrobatPath = `"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"`;
        if (fs_1.default.existsSync(acrobatPath.replace(/"/g, ""))) {
            await new Promise((resolve, reject) => {
                (0, child_process_1.exec)(`${acrobatPath} /h /t "${pdfPath}"`, (error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
            return;
        }
    }
    await electron_1.shell.openPath(pdfPath);
});
electron_1.ipcMain.handle("open-system-print", async (_event, html) => {
    const printWindow = new electron_1.BrowserWindow({
        show: false,
        webPreferences: {
            offscreen: true,
        },
    });
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    await new Promise((resolve, reject) => {
        printWindow.webContents.print({
            silent: false,
            printBackground: true,
            margins: { marginType: "none" },
        }, (success, errorType) => {
            printWindow.close();
            if (!success) {
                reject(new Error(errorType || "Print failed"));
                return;
            }
            resolve();
        });
    });
});
electron_1.ipcMain.handle("open-print-preview", async (_event, contentHTML) => {
    try {
        const { initPrintPgae, startPrint } = getPrintPreviewLib();
        await initPrintPgae({
            style: `
        body {
          background-color: white;
          font-family: sans-serif;
        }
        .options {
          background-color: #f5f5f5;
        }
      `,
            script: `console.log('Предпросмотр загружен')`,
        });
        await startPrint({
            htmlString: contentHTML,
        }, undefined);
    }
    catch (err) {
        console.error("❌ Ошибка предпросмотра печати:", err);
        throw err;
    }
});
electron_1.ipcMain.handle("open-browser-print", async (_event, contentHTML) => {
    const printWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        show: true,
        webPreferences: {
            sandbox: true,
        },
    });
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
      <html>
        <head>
          <title>Предпросмотр</title>
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body onload="window.print()">
          ${contentHTML}
        </body>
      </html>
    `)}`);
});
electron_1.ipcMain.handle("generate-pdf", async (_event, html) => {
    const win = new electron_1.BrowserWindow({ show: false });
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    const pdfBuffer = await win.webContents.printToPDF({
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        printBackground: true,
        landscape: false,
    });
    win.close();
    const pdfPath = path_1.default.join(electron_1.app.getPath("downloads"), `tech-passport-${Date.now()}.pdf`);
    fs_1.default.writeFileSync(pdfPath, pdfBuffer);
    return pdfPath;
});
electron_1.ipcMain.handle("check-password", async (_event, inputPassword) => {
    return inputPassword === PASSWORD;
});
electron_1.ipcMain.handle("insert-registration-data", async (_event, formData) => {
    try {
        if (!formData) {
            throw new Error("Нет данных для сохранения");
        }
        await (0, database_1.insertRegistrationData)(formData);
        return { success: true, message: "Данные успешно сохранены!" };
    }
    catch (error) {
        console.error("Ошибка при сохранении:", error);
        throw new Error(error instanceof Error ? error.message : "Ошибка при сохранении данных");
    }
});
electron_1.ipcMain.handle("update-registration-data", async (_event, formData) => {
    try {
        if (!formData || !Number.isInteger(formData.id)) {
            throw new Error("Некорректные данные для обновления");
        }
        const updated = await (0, database_1.updateRegistrationData)(formData);
        return { success: true, data: updated };
    }
    catch (error) {
        console.error("Ошибка при обновлении:", error);
        throw new Error(error instanceof Error ? error.message : "Ошибка при обновлении данных");
    }
});
electron_1.ipcMain.handle("get-authorities", async () => {
    return (0, database_1.getAuthorities)();
});
electron_1.ipcMain.handle("get-authority-directory", async () => {
    return (0, database_1.getAuthorityDirectory)();
});
electron_1.ipcMain.handle("add-authority", async (_event, name) => {
    const normalizedName = typeof name === "string" ? name.trim() : "";
    if (!normalizedName) {
        throw new Error("Название госоргана не может быть пустым");
    }
    return (0, database_1.addAuthority)(normalizedName);
});
electron_1.ipcMain.handle("add-subdivision", async (_event, params) => {
    const authorityId = params?.authorityId;
    const normalizedName = typeof params?.name === "string" ? params.name.trim() : "";
    if (!Number.isInteger(authorityId) || authorityId <= 0) {
        throw new Error("Некорректный идентификатор госоргана");
    }
    if (!normalizedName) {
        throw new Error("Название подразделения не может быть пустым");
    }
    return (0, database_1.addSubdivision)(authorityId, normalizedName);
});
electron_1.ipcMain.handle("delete-authority", async (_event, id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Некорректный идентификатор госоргана");
    }
    await (0, database_1.deleteAuthority)(id);
    return { success: true };
});
electron_1.ipcMain.handle("delete-subdivision", async (_event, id) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Некорректный идентификатор подразделения");
    }
    await (0, database_1.deleteSubdivision)(id);
    return { success: true };
});
electron_1.ipcMain.handle("search-vehicle", async (_event, searchParams) => {
    const { type, query } = searchParams;
    if (!ALLOWED_SEARCH_FIELDS.has(type)) {
        throw new Error("Недопустимое поле для поиска");
    }
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
        return null;
    }
    const db = await (0, database_1.openDatabase)();
    try {
        return await db.get(`SELECT * FROM registrations WHERE ${type} = ?`, [normalizedQuery]);
    }
    finally {
        await db.close();
    }
});
electron_1.app
    .whenReady()
    .then(async () => {
    await (0, database_1.createTable)();
    await createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            void createWindow();
        }
    });
})
    .catch((error) => {
    console.error("Ошибка запуска приложения:", error);
    electron_1.app.quit();
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
