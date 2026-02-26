const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const fsExtra = require("fs-extra");
const { PowerShell } = require("node-powershell");
const crypto = require("crypto");

let mainWindow;

function createWindow() {
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    icon: path.join(__dirname, "../public/icons/icon.png"),
    backgroundColor: "#0f172a",
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    (isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../out/index.html")}`);

  mainWindow.loadURL(startUrl);

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// ----------------------------------------------------------------
// IPC Handlers
// ----------------------------------------------------------------

ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () =>
  mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize(),
);
ipcMain.on("window-close", () => mainWindow?.close());

// --- FILE SYSTEM ---
ipcMain.handle("fs-read-dir", async (event, dirPath) => {
  try {
    const targetPath = dirPath === "root" ? "/" : dirPath;

    if (dirPath === "root" && process.platform === "win32") {
      const { exec } = require("child_process");
      return new Promise((resolve) => {
        const cmd = `Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root | ConvertTo-Json`;
        exec(
          `powershell.exe -Command "${cmd.replace(/"/g, '\\"')}"`,
          (error, stdout) => {
            if (error || !stdout.trim()) return resolve([]);
            try {
              const data = JSON.parse(stdout);
              const drives = (Array.isArray(data) ? data : [data]).map((d) => ({
                name: d.Name + ":",
                type: "drive",
                path: d.Root,
              }));
              resolve(drives);
            } catch (e) {
              resolve([]);
            }
          },
        );
      });
    }

    const items = await fs.readdir(targetPath, { withFileTypes: true });
    return items
      .map((item) => ({
        name: item.name,
        type: item.isDirectory() ? "folder" : "file",
        path: path.join(targetPath, item.name),
        size: item.isFile() ? "Unknown" : null,
      }))
      .filter((item) => !item.name.startsWith("."));
  } catch (error) {
    return [];
  }
});

ipcMain.handle("fs-get-quick-access", async () => {
  const os = require("os");
  const home = os.homedir();
  const fsSync = require("fs");
  const onedrive = path.join(home, "OneDrive");

  const getPath = (folder) => {
    const p1 = path.join(onedrive, folder);
    if (fsSync.existsSync(p1)) return p1;
    const p2 = path.join(home, folder);
    if (fsSync.existsSync(p2)) return p2;
    return null;
  };

  return [
    { name: "Desktop", icon: "desktop", path: getPath("Desktop") },
    { name: "Documents", icon: "file-text", path: getPath("Documents") },
    { name: "Downloads", icon: "download", path: path.join(home, "Downloads") },
    { name: "Pictures", icon: "image", path: getPath("Pictures") },
  ].filter((f) => f.path);
});

// --- COMMANDS ---
ipcMain.handle("exec-command", async (event, command) => {
  const { exec } = require("child_process");
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({ success: !error, output: stdout || stderr });
    });
  });
});

ipcMain.handle("exec-powershell", async (event, command) => {
  const { exec } = require("child_process");
  const psCommand = `powershell.exe -ExecutionPolicy Bypass -Command "${command.replace(/"/g, '\\"')}"`;
  return new Promise((resolve) => {
    exec(psCommand, (error, stdout, stderr) => {
      resolve({ success: !error, output: stdout.trim(), error: stderr.trim() });
    });
  });
});

// --- RDP & APP ---
ipcMain.handle("launch-app", async (event, { appPath, args = [] }) => {
  const { spawn } = require("child_process");
  try {
    const subprocess = spawn(appPath, args, {
      detached: true,
      stdio: "ignore",
    });
    subprocess.unref();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("connect-rdp", async (event, ip) => {
  require("child_process").exec(`mstsc /v:${ip}`);
  return { success: true };
});

// --- FILE OPERATIONS ---
ipcMain.handle("fs-copy", async (event, { source, destination }) => {
  try {
    const src = path.normalize(source);
    const dest = path.normalize(destination);
    if (!fsExtra.existsSync(src))
      return { success: false, error: "Source not found" };
    await fsExtra.ensureDir(path.dirname(dest));
    await fsExtra.copy(src, dest, { overwrite: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs-delete", async (event, targetPath) => {
  try {
    await fsExtra.remove(path.normalize(targetPath));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs-rename", async (event, { oldPath, newPath }) => {
  try {
    await fsExtra.move(path.normalize(oldPath), path.normalize(newPath), {
      overwrite: true,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs-exists-remote", async (event, filePath) => {
  const fsSync = require("fs");
  try {
    fsSync.accessSync(path.normalize(filePath), fsSync.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
});

ipcMain.handle("fs-checksum", async (event, filePath) => {
  return new Promise((resolve) => {
    try {
      const hash = crypto.createHash("sha256");
      const stream = fsExtra.createReadStream(path.normalize(filePath));
      stream.on("error", (err) =>
        resolve({ success: false, error: err.message }),
      );
      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () =>
        resolve({ success: true, hash: hash.digest("hex") }),
      );
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
});

ipcMain.handle("fs-hash-remote", async (event, filePath) => {
  const fsSync = require("fs");
  return new Promise((resolve) => {
    try {
      const hash = crypto.createHash("sha256");
      const stream = fsSync.createReadStream(path.normalize(filePath));
      stream.on("error", (err) =>
        resolve({ success: false, error: err.message }),
      );
      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () =>
        resolve({ success: true, hash: hash.digest("hex") }),
      );
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
});

// --- SERVICE & MESSAGE ---
ipcMain.handle("service-manage", async (event, { ip, serviceName, action }) => {
  const { exec } = require("child_process");
  const command = `sc \\\\${ip} ${action} "${serviceName}"`;
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (
        !error ||
        stdout.includes("PENDING") ||
        stdout.includes("SUCCESS") ||
        stdout.includes("1062") ||
        stdout.includes("1056")
      ) {
        resolve({ success: true, output: stdout });
      } else {
        resolve({ success: false, error: stderr || stdout || error.message });
      }
    });
  });
});

ipcMain.handle("send-msg", async (event, { ip, message }) => {
  const { exec } = require("child_process");
  return new Promise((resolve) => {
    exec(`msg * /server:${ip} "${message}"`, (error) => {
      resolve({ success: !error });
    });
  });
});

// --- LOGGING ---
ipcMain.handle("fs-append-log", async (event, message) => {
  const logPath = path.join(app.getPath("userData"), "operation_history.log");
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  fsExtra.appendFile(logPath, `[${timestamp}] ${message}\n`).catch(() => {});
});
