import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'DataBase');

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
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default structure
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
    updatedAt: new Date().toISOString()
  };
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
  return content;
}

// Database operations
export const db = {
  // Systems
  systems: {
    async getAll() {
      const result = await readJsonFile('systems');
      return result.data || [];
    },
    async getById(id) {
      const systems = await this.getAll();
      return systems.find(s => s.id === id);
    },
    async create(system) {
      const systems = await this.getAll();
      const newSystem = {
        ...system,
        id: `sys_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      systems.push(newSystem);
      await writeJsonFile('systems', systems);
      return newSystem;
    },
    async update(id, updates) {
      const systems = await this.getAll();
      const index = systems.findIndex(s => s.id === id);
      if (index === -1) throw new Error('System not found');
      systems[index] = { ...systems[index], ...updates, updatedAt: new Date().toISOString() };
      await writeJsonFile('systems', systems);
      return systems[index];
    },
    async delete(id) {
      const systems = await this.getAll();
      const filtered = systems.filter(s => s.id !== id);
      await writeJsonFile('systems', filtered);
      return { success: true };
    }
  },

  // Destinations
  destinations: {
    async getAll() {
      const result = await readJsonFile('destinations');
      return result.data || [];
    },
    async getById(id) {
      const destinations = await this.getAll();
      return destinations.find(d => d.id === id);
    },
    async create(destination) {
      const destinations = await this.getAll();
      const newDestination = {
        ...destination,
        id: `dest_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      destinations.push(newDestination);
      await writeJsonFile('destinations', destinations);
      return newDestination;
    },
    async update(id, updates) {
      const destinations = await this.getAll();
      const index = destinations.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Destination not found');
      destinations[index] = { ...destinations[index], ...updates, updatedAt: new Date().toISOString() };
      await writeJsonFile('destinations', destinations);
      return destinations[index];
    },
    async delete(id) {
      const destinations = await this.getAll();
      const filtered = destinations.filter(d => d.id !== id);
      await writeJsonFile('destinations', filtered);
      return { success: true };
    }
  },

  // Equipments
  equipments: {
    async getAll() {
      const result = await readJsonFile('equipments');
      return result.data || [];
    },
    async getByBranch(branch) {
      const equipments = await this.getAll();
      return equipments.filter(e => e.branch === branch);
    },
    async getByType(type) {
      const equipments = await this.getAll();
      return equipments.filter(e => e.type === type);
    },
    async create(equipment) {
      const equipments = await this.getAll();
      const newEquipment = {
        ...equipment,
        id: `equip_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      equipments.push(newEquipment);
      await writeJsonFile('equipments', equipments);
      return newEquipment;
    },
    async update(id, updates) {
      const equipments = await this.getAll();
      const index = equipments.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Equipment not found');
      equipments[index] = { ...equipments[index], ...updates, updatedAt: new Date().toISOString() };
      await writeJsonFile('equipments', equipments);
      return equipments[index];
    },
    async delete(id) {
      const equipments = await this.getAll();
      const filtered = equipments.filter(e => e.id !== id);
      await writeJsonFile('equipments', filtered);
      return { success: true };
    }
  },

  // Branches
  branches: {
    async getAll() {
      const result = await readJsonFile('branches');
      return result.data || [];
    },
    async create(branch) {
      const branches = await this.getAll();
      const newBranch = {
        ...branch,
        id: `branch_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      branches.push(newBranch);
      await writeJsonFile('branches', branches);
      return newBranch;
    },
    async update(id, updates) {
      const branches = await this.getAll();
      const index = branches.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Branch not found');
      branches[index] = { ...branches[index], ...updates };
      await writeJsonFile('branches', branches);
      return branches[index];
    },
    async delete(id) {
      const branches = await this.getAll();
      const filtered = branches.filter(b => b.id !== id);
      await writeJsonFile('branches', filtered);
      return { success: true };
    }
  },

  // Settings
  settings: {
    async get() {
      const result = await readJsonFile('settings');
      return result.data || this.getDefaults();
    },
    async update(settings) {
      await writeJsonFile('settings', settings);
      return settings;
    },
    getDefaults() {
      return {
        theme: 'dark',
        language: 'en',
        pingInterval: 5000,
        appPaths: {
          winbox: '',
          termius: '',
          teamviewer: ''
        },
        customTheme: null
      };
    }
  },

  // Users (for authentication)
  users: {
    async getAll() {
      const result = await readJsonFile('users');
      return result.data || [];
    },
    async getByUsername(username) {
      const users = await this.getAll();
      return users.find(u => u.username === username);
    },
    async create(user) {
      const users = await this.getAll();
      const newUser = {
        ...user,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      await writeJsonFile('users', users);
      return newUser;
    },
    async initDefaultUser() {
      const users = await this.getAll();
      if (users.length === 0) {
        await this.create({
          username: 'admin',
          password: 'admin', // In production, hash this!
          role: 'admin'
        });
      }
    }
  }
};

export default db;