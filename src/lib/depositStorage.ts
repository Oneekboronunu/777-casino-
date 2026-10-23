import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: string;
  accountNumber: string;
  txId: string;
  screenshot?: string | null;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback cache
let inMemoryDeposits: DepositRequest[] = [];

const BACKUP_FILE = path.join(process.cwd(), "prisma", "deposits.json");

function loadBackupDeposits(): DepositRequest[] {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const data = fs.readFileSync(BACKUP_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("Could not read deposits backup file:", e);
  }
  return inMemoryDeposits;
}

function saveBackupDeposits(deposits: DepositRequest[]) {
  try {
    inMemoryDeposits = deposits;
    const dir = path.dirname(BACKUP_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(deposits, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write deposits backup file:", e);
  }
}

export async function createDepositRequest(data: {
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: string;
  accountNumber: string;
  txId: string;
  screenshot?: string | null;
  applyBonus?: boolean;
}): Promise<DepositRequest> {
  const depositId = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const notePayload = JSON.stringify({
    userName: data.userName,
    userPhone: data.userPhone,
    screenshot: data.screenshot || null,
    applyBonus: data.applyBonus ?? true,
  });

  const newRequest: DepositRequest = {
    id: depositId,
    userId: data.userId,
    userName: data.userName,
    userPhone: data.userPhone,
    amount: data.amount,
    method: data.method,
    accountNumber: data.accountNumber,
    txId: data.txId.toUpperCase(),
    screenshot: data.screenshot || null,
    status: "PENDING",
    note: notePayload,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Try Prisma DB
  try {
    await prisma.transaction.create({
      data: {
        id: depositId,
        userId: data.userId,
        type: "DEPOSIT",
        amount: data.amount,
        method: data.method,
        accountNumber: data.accountNumber,
        txId: data.txId.toUpperCase(),
        status: "PENDING",
        note: notePayload,
      },
    });
  } catch (dbErr) {
    console.warn("DB save failed, using fallback storage:", dbErr);
  }

  // 2. Always save in backup storage
  const current = loadBackupDeposits();
  current.unshift(newRequest);
  saveBackupDeposits(current);

  return newRequest;
}

export async function getAllDepositRequests(): Promise<DepositRequest[]> {
  const backup = loadBackupDeposits();

  try {
    const dbTransactions = await prisma.transaction.findMany({
      where: { type: "DEPOSIT" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true },
    });

    if (dbTransactions.length > 0) {
      const mergedMap = new Map<string, DepositRequest>();
      // Put backup first
      backup.forEach((b) => mergedMap.set(b.id, b));

      // Put DB items
      dbTransactions.forEach((t) => {
        let parsedScreenshot = null;
        let parsedUserName = t.user?.name || "Player";
        let parsedUserPhone = t.accountNumber || t.user?.phone || "017XXXXXXXX";

        if (t.note) {
          try {
            const parsed = JSON.parse(t.note);
            if (parsed.screenshot) parsedScreenshot = parsed.screenshot;
            if (parsed.userName) parsedUserName = parsed.userName;
            if (parsed.userPhone) parsedUserPhone = parsed.userPhone;
          } catch {
            // plain text note
          }
        }

        mergedMap.set(t.id, {
          id: t.id,
          userId: t.userId,
          userName: parsedUserName,
          userPhone: parsedUserPhone,
          amount: t.amount,
          method: t.method,
          accountNumber: t.accountNumber || parsedUserPhone,
          txId: t.txId || "N/A",
          screenshot: parsedScreenshot,
          status: (t.status as any) || "PENDING",
          note: t.note,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        });
      });

      const list = Array.from(mergedMap.values());
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    }
  } catch (e) {
    console.warn("Prisma get deposits failed, using backup:", e);
  }

  return backup;
}

export async function updateDepositStatus(
  depositId: string,
  status: "COMPLETED" | "REJECTED",
  creditedType?: "CASH" | "COINS",
  creditedAmount?: number
): Promise<DepositRequest | null> {
  const backup = loadBackupDeposits();
  const target = backup.find((d) => d.id === depositId);
  if (target) {
    target.status = status;
    target.updatedAt = new Date().toISOString();
    saveBackupDeposits(backup);
  }

  try {
    await prisma.transaction.update({
      where: { id: depositId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  } catch (e) {
    console.warn("Prisma update deposit failed:", e);
  }

  return target || null;
}
