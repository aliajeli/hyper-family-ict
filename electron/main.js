const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs").promises;
const fsExtra = require("fs-extra"); // Make sure fs-extra is installed
const { PowerShell } = require("node-powershell");
const crypto = require("crypto");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false, // Custom Titlebar
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Required for Node APIs
    },
    icon: path.join(__dirname, "../public/icons/icon.png"),
    backgroundColor: "#0f172a",
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "../out/index.html")}`;
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// ----------------------------------------------------------------
// IPC Handlers
// ----------------------------------------------------------------

// Window Controls
ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on("window-close", () => mainWindow?.close());

// Execute Simple Command
ipcMain.handle("exec-command", async (event, command) => {
  const { exec } = require("child_process");
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({
        success: !error,
        output: stdout || stderr,
      });
    });
  });
});

// Execute PowerShell Script
ipcMain.handle("exec-powershell", async (event, command) => {
  const { exec } = require("child_process");
  // Use PowerShell explicitly with Bypass policy
  const psCommand = `powershell.exe -ExecutionPolicy Bypass -Command "${command.replace(/"/g, '\\"')}"`;

  return new Promise((resolve) => {
    exec(psCommand, (error, stdout, stderr) => {
      resolve({
        success: !error,
        output: stdout.trim(),
        error: stderr.trim(),
      });
    });
  });
});

// Launch External App
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

// Connect RDP
ipcMain.handle("connect-rdp", async (event, ip) => {
  const { exec } = require("child_process");
  exec(`mstsc /v:${ip}`);
  return { success: true };
});

// --- FILE OPERATIONS (COPY, DELETE, RENAME) ---

// // Copy File/Folder
// ipcMain.handle('fs-copy', async (event, { source, destination }) => {
//   try {
//     // Normalize paths
//     const src = path.normalize(source);
//     const dest = path.normalize(destination);

//     // Check source
//     if (!fsExtra.existsSync(src)) {
//         return { success: false, error: `Source not found: ${src}` };
//     }

//     // Create destination folder if needed
//     await fsExtra.ensureDir(path.dirname(dest));

//     console.log(`Copying: ${src} -> ${dest}`);
//     await fsExtra.copy(src, dest, { overwrite: true, errorOnExist: false });

//     return { success: true };
//   } catch (error) {
//     console.error('Copy Error:', error);
//     return { success: false, error: error.message };
//   }
// });

// Copy File/Folder Handler (Debug Version)
ipcMain.handle("fs-copy", async (event, { source, destination }) => {
  console.log("------------------------------------------------");
  console.log("📥 COPY REQUEST RECEIVED");
  console.log("📍 Source Raw:", source);
  console.log("📍 Dest Raw:", destination);

  try {
    const fsExtra = require("fs-extra");
    const path = require("path");

    // 1. Normalize Paths
    const src = path.resolve(source); // Resolve to absolute path
    const dest = path.resolve(destination); // Resolve to absolute path

    console.log("✅ Normalized Source:", src);
    console.log("✅ Normalized Dest:", dest);

    // 2. Check Source Existence
    if (!fsExtra.existsSync(src)) {
      console.error("❌ ERROR: Source file does not exist!");
      return { success: false, error: `Source not found: ${src}` };
    }

    // 3. Ensure Destination Directory Exists
    const destDir = path.dirname(dest);
    console.log("📂 Ensuring directory exists:", destDir);
    await fsExtra.ensureDir(destDir);

    // 4. Perform Copy
    console.log("🚀 Starting copy operation...");
    await fsExtra.copy(src, dest, { overwrite: true, errorOnExist: false });

    console.log("🎉 Copy Success!");
    console.log("------------------------------------------------");
    return { success: true };
  } catch (error) {
    console.error("❌ COPY FAILED:", error);
    console.log("------------------------------------------------");
    return { success: false, error: error.message };
  }
});

// Delete File/Folder
ipcMain.handle("fs-delete", async (event, targetPath) => {
  try {
    await fsExtra.remove(path.normalize(targetPath));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Rename/Move File/Folder
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

// Check Exists
ipcMain.handle("fs-exists", async (event, targetPath) => {
  return fsExtra.existsSync(path.normalize(targetPath));
});

// Checksum
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

// Check Remote File Exists (Direct check via SMB)
ipcMain.handle("fs-exists-remote", async (event, path) => {
  const fs = require("fs");
  try {
    // Normalize path for Windows
    const normalizedPath = path.replace(/\//g, "\\");

    // fs.accessSync throws if file doesn't exist or no permission
    fs.accessSync(normalizedPath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
});

// Calculate Remote Hash (Direct Read via SMB)
ipcMain.handle("fs-hash-remote", async (event, path) => {
  const crypto = require("crypto");
  const fs = require("fs");

  return new Promise((resolve) => {
    try {
      // Normalize path for Windows
      const normalizedPath = path.replace(/\//g, "\\");

      const hash = crypto.createHash("sha256");
      const stream = fs.createReadStream(normalizedPath);

      stream.on("error", (err) => {
        console.error("Remote Hash Error:", err);
        resolve({ success: false, error: err.message });
      });

      stream.on("data", (chunk) => hash.update(chunk));

      stream.on("end", () => {
        resolve({ success: true, hash: hash.digest("hex") });
      });
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
});

// Service Management (Debug)
ipcMain.handle("service-manage", async (event, { ip, serviceName, action }) => {
  const { exec } = require("child_process");
  const command = `sc \\\\${ip} ${action} "${serviceName}"`;

  console.log(`📡 Executing: ${command}`); // Log Command

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      console.log("🔹 SC STDOUT:", stdout);
      console.log("🔸 SC STDERR:", stderr);
      console.log("🔻 SC ERROR:", error ? error.message : "None");

      // اگر خروجی شامل کلمات کلیدی موفقیت بود، قبول کن
      // 1062 = Service has not been started (یعنی قبلاً استاپ بوده، پس موفق فرض می‌کنیم)
      // 1056 = An instance of the service is already running (یعنی قبلاً استارت بوده، پس موفق فرض می‌کنیم)

      if (!error || stdout.includes("PENDING") || stdout.includes("SUCCESS")) {
        resolve({ success: true, output: stdout });
      } else {
        // Handle "Already running" or "Already stopped" as success
        if (stdout.includes("1062") || stdout.includes("1056")) {
          resolve({ success: true, output: "Already in desired state" });
        } else {
          resolve({ success: false, error: stderr || stdout || error.message });
        }
      }
    });
  });
});

// Send Message (Debug)
ipcMain.handle("send-msg", async (event, { ip, message }) => {
  const { exec } = require("child_process");
  const command = `msg * /server:${ip} "${message}"`;

  console.log(`📡 Executing: ${command}`);

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      console.log("🔹 MSG STDOUT:", stdout);
      console.log("🔸 MSG STDERR:", stderr);

      if (error) {
        resolve({ success: false, error: stderr || error.message });
      } else {
        resolve({ success: true });
      }
    });
  });
});

// Append to Log File
ipcMain.handle("fs-append-log", async (event, message) => {
  const fs = require("fs");
  const path = require("path");

  // فایل لاگ در کنار فایل اجرایی یا روت پروژه
  const logPath = path.join(app.getPath("userData"), "operation_history.log");
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  const logLine = `[${timestamp}] ${message}\n`;

  fs.appendFile(logPath, logLine, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
});

//-----------
// ...

// 1. Get Drives & Directory Logic
ipcMain.handle("fs-read-dir", async (event, dirPath) => {
  try {
    const fs = require("fs").promises;
    const path = require("path");

    // Handle Root (Drives)
    if (dirPath === "root") {
      if (process.platform === "win32") {
        const { exec } = require("child_process");
        return new Promise((resolve) => {
          // استفاده از دستور powershell برای لیست دقیق‌تر درایوها
          const cmd = `Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root | ConvertTo-Json`;

          exec(
            `powershell.exe -Command "${cmd.replace(/"/g, '\\"')}"`,
            (error, stdout) => {
              if (error || !stdout.trim()) {
                // Fallback: Check common drive letters if powershell fails
                const common = ["C", "D", "E", "F", "G", "H"];
                const valid = [];
                // این بخش همگام (Sync) نیست، پس بهتر است از fs.access استفاده نکنیم در اینجا
                // فقط برمی‌گردیم به روش ساده wmic اگر پاورشل خراب بود
                return resolve([]);
              }

              try {
                const data = JSON.parse(stdout);
                const drives = (Array.isArray(data) ? data : [data]).map(
                  (d) => ({
                    name: d.Name + ":", // C:
                    type: "drive",
                    path: d.Root, // C:\
                  }),
                );
                resolve(drives);
              } catch (e) {
                resolve([]);
              }
            },
          );
        });
      }
      return [{ name: "/", type: "drive", path: "/" }];
    }

    // Handle Normal Directory
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    return items
      .map((item) => ({
        name: item.name,
        type: item.isDirectory() ? "folder" : "file",
        path: path.join(dirPath, item.name),
        size: item.isFile() ? "Unknown" : null,
      }))
      .filter((item) => !item.name.startsWith("."));
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
});

// 2. Get User Home Folders (OneDrive Aware)
ipcMain.handle("fs-get-quick-access", async () => {
  const os = require("os");
  const path = require("path");
  const fs = require("fs");

  const home = os.homedir(); // C:\Users\Ali
  const onedrive = path.join(home, "OneDrive");

  // Helper to check path existence
  const getValidPath = (folderName) => {
    // 1. Check OneDrive path first (e.g. C:\Users\Ali\OneDrive\Desktop)
    const onedrivePath = path.join(onedrive, folderName);
    if (fs.existsSync(onedrivePath)) return onedrivePath;

    // 2. Check Standard path (e.g. C:\Users\Ali\Desktop)
    const standardPath = path.join(home, folderName);
    if (fs.existsSync(standardPath)) return standardPath;

    return null;
  };

  const folders = [
    { name: "Desktop", icon: "desktop", path: getValidPath("Desktop") },
    { name: "Documents", icon: "file-text", path: getValidPath("Documents") },
    { name: "Downloads", icon: "download", path: path.join(home, "Downloads") }, // Downloads usually not in OneDrive
    { name: "Pictures", icon: "image", path: getValidPath("Pictures") },
  ];

  // Filter out null paths (if folder doesn't exist)
  return folders.filter((f) => f.path !== null);
});
