import { app, BrowserWindow, ipcMain, shell } from "electron";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { createTable, insertRegistrationData, openDatabase } from "./database";

type PrintPreviewLib = {
  startPrint: (options: { htmlString: string }, browserWindow?: unknown) => Promise<void>;
  initPrintPgae: (options: { style?: string; script?: string }) => Promise<void>;
};

let printPreviewLib: PrintPreviewLib | null = null;

const getPrintPreviewLib = (): PrintPreviewLib => {
  if (!printPreviewLib) {
    printPreviewLib = require("electron-print-preview") as PrintPreviewLib;
  }
  return printPreviewLib;
};

let mainWindow: BrowserWindow | null = null;
const PASSWORD = process.env.RTS_OP_PASSWORD ?? "123";
const ALLOWED_SEARCH_FIELDS = new Set(["stateNumber", "techPassportNumber"]);

const createWindow = async () => {
  const preloadPath = path.join(__dirname, "preload.js");

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

  const devServerUrl = process.env.ELECTRON_RENDERER_URL;

  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    const rendererCandidates = [
      path.join(__dirname, "../renderer/index.html"),
      path.join(__dirname, "../../src/renderer/dist/index.html"),
      path.join(process.cwd(), "src/renderer/dist/index.html"),
    ];
    const rendererEntry = rendererCandidates.find((candidate) => fs.existsSync(candidate));
    if (!rendererEntry) {
      throw new Error(
        "Renderer entry point not found. Run `npm run build:renderer` or set ELECTRON_RENDERER_URL.",
      );
    }
    await mainWindow.loadFile(rendererEntry);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

ipcMain.handle("print-generated-pdf", async (_event, pdfPath: string) => {
  if (!fs.existsSync(pdfPath)) {
    throw new Error("PDF файл не найден");
  }

  if (process.platform === "win32") {
    const acrobatPath = `"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe"`;
    if (fs.existsSync(acrobatPath.replace(/"/g, ""))) {
      await new Promise<void>((resolve, reject) => {
        exec(`${acrobatPath} /h /t "${pdfPath}"`, (error) => {
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

  await shell.openPath(pdfPath);
});

ipcMain.handle("open-system-print", async (_event, html: string) => {
  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });

  await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  await new Promise<void>((resolve, reject) => {
    printWindow.webContents.print(
      {
        silent: false,
        printBackground: true,
        margins: { marginType: "none" },
      },
      (success, errorType) => {
        printWindow.close();
        if (!success) {
          reject(new Error(errorType || "Print failed"));
          return;
        }
        resolve();
      },
    );
  });
});

ipcMain.handle("open-print-preview", async (_event, contentHTML: string) => {
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

    await startPrint(
      {
        htmlString: contentHTML,
      },
      undefined,
    );
  } catch (err) {
    console.error("❌ Ошибка предпросмотра печати:", err);
    throw err;
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

  await printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
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
    `)}`,
  );
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
    printBackground: true,
    landscape: false,
  });

  win.close();

  const pdfPath = path.join(app.getPath("downloads"), `tech-passport-${Date.now()}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);

  return pdfPath;
});

ipcMain.handle("check-password", async (_event, inputPassword: string) => {
  return inputPassword === PASSWORD;
});

ipcMain.handle("insert-registration-data", async (_event, formData) => {
  try {
    if (!formData) {
      throw new Error("Нет данных для сохранения");
    }

    await insertRegistrationData(formData);
    return { success: true, message: "Данные успешно сохранены!" };
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    throw new Error(error instanceof Error ? error.message : "Ошибка при сохранении данных");
  }
});

ipcMain.handle("search-vehicle", async (_event, searchParams: { type: string; query: string }) => {
  const { type, query } = searchParams;
  if (!ALLOWED_SEARCH_FIELDS.has(type)) {
    throw new Error("Недопустимое поле для поиска");
  }

  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return null;
  }

  const db = await openDatabase();
  try {
    return await db.get(`SELECT * FROM registrations WHERE ${type} = ?`, [normalizedQuery]);
  } finally {
    await db.close();
  }
});

app
  .whenReady()
  .then(async () => {
    await createTable();
    await createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        void createWindow();
      }
    });
  })
  .catch((error) => {
    console.error("Ошибка запуска приложения:", error);
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
