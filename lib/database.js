import { promises as fs } from "fs";
import path from "path";

// مسیر دقیق دیتابیس (نسبت به روت پروژه)
const DB_PATH = path.resolve("./DataBase");

// Ensure database directory exists
async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true });
  }
}

// Read JSON file (Direct Read - No Cache)
async function readJsonFile(filename) {
  await ensureDbExists();
  const filePath = path.join(DB_PATH, `${filename}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { data: [], updatedAt: new Date().toISOString() };
    }
    throw error;
  }
}

// Write JSON file (Atomic Write)
async function writeJsonFile(filename, data) {
  await ensureDbExists();
  const filePath = path.join(DB_PATH, `${filename}.json`);

  const content = {
    data,
    updatedAt: new Date().toISOString(),
  };

  console.log(`💾 Writing to ${filename}.json (${data.length} items)`);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
  return content;
}

export const db = {
  // --- DESTINATIONS ---
  destinations: {
    async getAll() {
      const result = await readJsonFile("destinations");
      return result.data || [];
    },

    async getById(id) {
      const list = await this.getAll();
      return list.find((d) => d.id === id);
    },

    async create(destination) {
      const list = await this.getAll();
      const newDest = {
        ...destination,
        id: `dest_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      list.push(newDest);
      await writeJsonFile("destinations", list);
      return newDest;
    },

    async delete(id) {
      const list = await this.getAll();
      const filtered = list.filter((d) => d.id !== id);
      await writeJsonFile("destinations", filtered);
      return { success: true };
    },
  },

  // --- SYSTEMS ---
  systems: {
    async getAll() {
      const result = await readJsonFile("systems");
      return result.data || [];
    },

    async create(system) {
      const list = await this.getAll();
      const newSys = {
        ...system,
        id: `sys_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      list.push(newSys);
      await writeJsonFile("systems", list);
      return newSys;
    },

    async delete(id) {
      const list = await this.getAll();
      const filtered = list.filter((s) => s.id !== id);
      await writeJsonFile("systems", filtered);
      return { success: true };
    },
  },

  // --- BRANCHES ---
  branches: {
    async getAll() {
      const result = await readJsonFile("branches");
      return result.data || [];
    },
    async create(branch) {
      /* ... */
    },
    async delete(id) {
      /* ... */
    },
  },

  // --- SETTINGS ---
  settings: {
    async get() {
      const result = await readJsonFile("settings");
      return result.data || { theme: "dark" };
    },
    async update(settings) {
      await writeJsonFile("settings", settings);
      return settings;
    },
  },

  // --- USERS ---
  users: {
    async getByUsername(username) {
      const result = await readJsonFile("users");
      return (result.data || []).find((u) => u.username === username);
    },
  },
};

export default db;
