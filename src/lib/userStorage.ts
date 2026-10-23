import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export interface StoredUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  balance: number;
  bonusBalance: number;
  coins: number;
  couponCode?: string | null;
  createdAt: string;
}

const BACKUP_USERS_FILE = path.join(process.cwd(), "prisma", "registered_users.json");
let inMemoryUsers: StoredUser[] = [];

function loadBackupUsers(): StoredUser[] {
  try {
    if (fs.existsSync(BACKUP_USERS_FILE)) {
      const data = fs.readFileSync(BACKUP_USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read users backup file:", e);
  }
  return inMemoryUsers;
}

function saveBackupUsers(users: StoredUser[]) {
  try {
    inMemoryUsers = users;
    const dir = path.dirname(BACKUP_USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BACKUP_USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write users backup file:", e);
  }
}

export async function recordNewUser(user: {
  id: string;
  name: string;
  phone: string;
  email: string;
  role?: string;
  balance?: number;
  bonusBalance?: number;
  coins?: number;
  couponCode?: string | null;
}): Promise<StoredUser> {
  const newUser: StoredUser = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role || "USER",
    balance: user.balance ?? 2000,
    bonusBalance: user.bonusBalance ?? 2000,
    coins: user.coins ?? 1500,
    couponCode: user.couponCode || null,
    createdAt: new Date().toISOString(),
  };

  const current = loadBackupUsers();
  const existingIdx = current.findIndex((u) => u.id === user.id || u.phone === user.phone);
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...newUser };
  } else {
    current.unshift(newUser);
  }
  saveBackupUsers(current);
  return newUser;
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const backup = loadBackupUsers();

  try {
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (dbUsers.length > 0) {
      const mergedMap = new Map<string, StoredUser>();
      backup.forEach((u) => mergedMap.set(u.id, u));
      if (backup.length > 0) {
        backup.forEach((u) => {
          if (u.phone) mergedMap.set(u.phone, u);
        });
      }

      dbUsers.forEach((u) => {
        const existing = mergedMap.get(u.id) || (u.phone ? mergedMap.get(u.phone) : null);
        mergedMap.set(u.id, {
          id: u.id,
          name: u.name,
          phone: u.phone || existing?.phone || "017XXXXXXXX",
          email: u.email,
          role: u.role,
          balance: u.balance,
          bonusBalance: u.bonusBalance,
          coins: existing?.coins ?? 1500,
          couponCode: existing?.couponCode || null,
          createdAt: u.createdAt.toISOString(),
        });
      });

      const list = Array.from(mergedMap.values());
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    }
  } catch (e) {
    console.warn("Prisma fetch users error, using backup:", e);
  }

  return backup;
}

export async function adjustUserBalanceOrCoins(
  userId: string,
  deltaBalance: number,
  deltaCoins: number
): Promise<{ success: boolean; newBalance?: number; newCoins?: number }> {
  const backup = loadBackupUsers();
  const user = backup.find((u) => u.id === userId || u.phone === userId);

  let newBalance = user ? user.balance + deltaBalance : 2000 + deltaBalance;
  let newCoins = user ? (user.coins || 1500) + deltaCoins : 1500 + deltaCoins;

  if (user) {
    user.balance = Math.max(0, newBalance);
    user.coins = Math.max(0, newCoins);
    saveBackupUsers(backup);
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: deltaBalance },
      },
    });
    newBalance = updated.balance;
  } catch (e) {
    console.warn("Prisma adjust balance error:", e);
  }

  return { success: true, newBalance, newCoins };
}
