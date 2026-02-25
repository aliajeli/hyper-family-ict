import { promises as fs } from "fs";
import path from "path";

// مسیر دقیق دیتابیس
const DB_PATH = path.resolve("./DataBase");

// Ensure database directory exists
async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(DB_PATH, { recursive: true });
  }
}

// Read JSON file
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

// Write JSON file
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

    async update(id, updates) {
      const list = await this.getAll();
      const index = list.findIndex((s) => s.id === id);

      if (index === -1) throw new Error(`System ${id} not found`);

      // Merge updates
      const updatedSystem = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      list[index] = updatedSystem;

      await writeJsonFile("systems", list);
      return updatedSystem;
    },

    async delete(id) {
      const list = await this.getAll();
      const filtered = list.filter((s) => s.id !== id);
      await writeJsonFile("systems", filtered);
      return { success: true };
    },
  },

  // --- DESTINATIONS ---
  destinations: {
    async getAll() {
      const result = await readJsonFile("destinations");
      return result.data || [];
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

    async update(id, updates) {
      const list = await this.getAll();
      const index = list.findIndex((d) => d.id === id);
      if (index === -1) throw new Error("Destination not found");

      list[index] = { ...list[index], ...updates };
      await writeJsonFile("destinations", list);
      return list[index];
    },

    async delete(id) {
      const list = await this.getAll();
      const filtered = list.filter((d) => d.id !== id);
      await writeJsonFile("destinations", filtered);
      return { success: true };
    },
  },

  // --- EQUIPMENTS ---
  equipments: {
    async getAll() {
      const result = await readJsonFile("equipments");
      return result.data || [];
    },

    async create(item) {
      const list = await this.getAll();
      const newItem = {
        ...item,
        id: `eq_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      list.push(newItem);
      await writeJsonFile("equipments", list);
      return newItem;
    },

    async update(id, updates) {
      const list = await this.getAll();
      const index = list.findIndex((e) => e.id === id);
      if (index === -1) throw new Error("Equipment not found");

      list[index] = { ...list[index], ...updates };
      await writeJsonFile("equipments", list);
      return list[index];
    },

    async delete(id) {
      const list = await this.getAll();
      const filtered = list.filter((e) => e.id !== id);
      await writeJsonFile("equipments", filtered);
      return { success: true };
    },
  },

  // --- BRANCHES (Static or Dynamic) ---
  branches: {
    async getAll() {
      // اگر فایل branches.json دارید بخوانید، وگرنه هاردکد
      // return [ 'Lahijan', 'Ramsar', 'Nowshahr', 'Royan' ];
      const result = await readJsonFile("branches");
      return result.data || [];
    },
  },

  // --- USERS ---
  users: {
    async getAll() {
      const result = await readJsonFile("users");
      // اگر فایل خالی بود یا وجود نداشت، ادمین پیش‌فرض بساز
      if (!result.data || result.data.length === 0) {
        return [{ username: "admin", password: "admin", role: "admin" }];
      }
      return result.data;
    },

    async getByUsername(username) {
      const users = await this.getAll();
      return users.find((u) => u.username === username);
    },

    async create(user) {
      const list = await this.getAll();
      const newUser = { ...user, id: `u_${Date.now()}` };
      list.push(newUser);
      await writeJsonFile("users", list);
      return newUser;
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
};

export default db;
