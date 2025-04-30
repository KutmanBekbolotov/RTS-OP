"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
const database_2 = require("./database");
const { startPrint, initPrintPgae } = require("electron-print-preview");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
let mainWindow;
const PASSWORD = "123";
const createWindow = () => {
    const MAIN_PATH = path_1.default.join(__dirname, "..");
    const preloadPath = path_1.default.join(__dirname, "preload.js");
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
electron_1.ipcMain.handle('print-generated-pdf', async (_event, pdfPath) => {
    console.log('Печать PDF:', pdfPath);
    const acrobatPath = `"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"`;
    try {
        (0, child_process_1.exec)(`${acrobatPath} /h /t "${pdfPath}"`, (error) => {
            if (error) {
                console.error("Ошибка печати PDF:", error);
            }
        });
    }
    catch (error) {
        console.error('Ошибка при отправке PDF в печать:', error);
    }
});
electron_1.ipcMain.handle('open-system-print', async (_event, html) => {
    const printWindow = new electron_1.BrowserWindow({
        show: false,
        webPreferences: {
            offscreen: true,
        },
    });
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    setTimeout(() => {
        printWindow.webContents.print({
            silent: false,
            printBackground: true,
            margins: { marginType: 'none' },
        }, (success, errorType) => {
            if (!success) {
                console.error('❌ Print failed:', errorType);
            }
            else {
                console.log('✅ Print success');
            }
            printWindow.close();
        });
    }, 100);
});
electron_1.ipcMain.handle("open-print-preview", async (_event, contentHTML) => {
    try {
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
        // pageSize: {
        //   width: 1480,  
        //   height: 1050, 
        // },
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
electron_1.ipcMain.handle("search-vehicle", async (_, searchParams) => {
    try {
        const db = await (0, database_2.openDatabase)();
        const { type, query } = searchParams;
        const result = await db.get(`SELECT * FROM registrations WHERE ${type} = ?`, [query]);
        return result;
    }
    catch (error) {
        console.error("Error searching vehicle:", error);
        throw error;
    }
});
