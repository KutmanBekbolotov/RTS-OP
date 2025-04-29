import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createTable, insertRegistrationData } from "./database";
import { openDatabase } from "./database";
const { startPrint, initPrintPgae } = require("electron-print-preview");
import fs from "fs";
import { exec } from 'child_process';

let mainWindow: BrowserWindow;
const PASSWORD = "123";

const createWindow = () => {
  const MAIN_PATH = path.join(__dirname, "..");
  const preloadPath = path.join(__dirname, "preload.js");


  console.log("Preload path:", preloadPath);

  mainWindow = new BrowserWindow({
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
    mainWindow = null!;
  });
};

ipcMain.handle('print-generated-pdf', async (_event, pdfPath: string) => {
  console.log('Печать PDF:', pdfPath);
  try {
    // На Windows
    exec(`start /WAIT acrord32.exe /h /t "${pdfPath}"`, (error) => {
      if (error) {
        console.error("Ошибка печати PDF:", error);
      }
    });
  } catch (error) {
    console.error('Ошибка при отправке PDF в печать:', error);
  }
});

ipcMain.handle('open-system-print', async (_event, html) => {
  const printWindow = new BrowserWindow({
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
      } else {
        console.log('✅ Print success');
      }
      printWindow.close();
    });
  }, 100);
  
});


ipcMain.handle("open-print-preview", async (_event, contentHTML: string) => {
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
  } catch (err) {
    console.error("❌ Ошибка предпросмотра печати:", err);
  }
});


ipcMain.handle("open-browser-print", async (_event, contentHTML: string) => {
  const printWindow = new BrowserWindow({
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


ipcMain.handle("generate-pdf", async (_event, html: string) => {
  const win = new BrowserWindow({ show: false });
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

  
  const pdfPath = path.join(app.getPath("downloads"), `tech-passport-${Date.now()}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);

  return pdfPath;
});



ipcMain.handle("check-password", async (_event, inputPassword) => {
  return inputPassword === PASSWORD;
});

(async () => {
  try {
    await createTable();
    console.log("База данных инициализирована");
  } catch (error) {
    console.error("Ошибка при инициализации БД:", error);
  }
})();

app.whenReady().then(createWindow);

ipcMain.handle("insert-registration-data", async (event, formData) => {
  try {
    if (!formData) {
      throw new Error("Нет данных для сохранения");
    }
    console.log("Получены данные для сохранения:", formData);

    const result = await insertRegistrationData(formData);
    console.log("Данные сохранены:", result);

    return { success: true, message: "Данные успешно сохранены!" };
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    throw new Error(error instanceof Error ? error.message : "Ошибка при сохранении данных");
  }
});


ipcMain.handle("search-vehicle", async (_, searchParams: { type: string; query: string }) => {
  try {
    const db = await openDatabase();
    const { type, query } = searchParams;

    const result = await db.get(`SELECT * FROM registrations WHERE ${type} = ?`, [query]);

    return result;
  } catch (error) {
    console.error("Error searching vehicle:", error);
    throw error;
  }
});
