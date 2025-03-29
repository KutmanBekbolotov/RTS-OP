import { app, BrowserWindow, ipcMain } from "electron";
import path from 'path';
import { createTable, insertRegistrationData } from "./database";
import { openDatabase } from "./database";

let mainWindow: BrowserWindow;

const createWindow = () => {
  // Получаем абсолютный путь к preload.js
  const MAIN_PATH = path.join(__dirname, '..');
  const preloadPath = path.join(MAIN_PATH, 'main', 'preload.js');
  
  console.log('Preload path:', preloadPath); // для отладки

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // добавляем это
    },
  });

  mainWindow.loadURL("http://localhost:5173");
  mainWindow.webContents.openDevTools();

  // Добавляем обработчик для проверки загрузки preload
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window loaded');
    mainWindow.webContents.executeJavaScript('console.log("electron api:", window.electron)');
  });

  mainWindow.on("closed", () => {
    mainWindow = null!;
  });
};

(async () => {
  try {
    await createTable();
    console.log('База данных инициализирована');
  } catch (error) {
    console.error('Ошибка при инициализации БД:', error);
  }
})();

app.whenReady().then(createWindow);

ipcMain.handle("insert-registration-data", async (event, formData) => {
  try {
    if (!formData) {
      throw new Error('Нет данных для сохранения');
    }
    console.log('Получены данные для сохранения:', formData);
    
    const result = await insertRegistrationData(formData);
    console.log('Данные сохранены:', result);
    
    return { success: true, message: "Данные успешно сохранены!" };
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    throw new Error(error instanceof Error ? error.message : 'Ошибка при сохранении данных');
  }
});

ipcMain.handle('search-vehicle', async (_, searchParams: { type: string; query: string }) => {
  try {
    const db = await openDatabase();
    const { type, query } = searchParams;
    
    const result = await db.get(
      `SELECT * FROM registrations WHERE ${type} = ?`,
      [query]
    );
    
    return result;
  } catch (error) {
    console.error('Error searching vehicle:', error);
    throw error;
  }
});