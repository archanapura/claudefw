/**
 * utils/helpers.ts
 * Generic utility functions used across the framework.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Logger ───────────────────────────────────────────────────────────────────

export const Logger = {
  info: (msg: string) => console.log(`[INFO]  ${timestamp()} ${msg}`),
  warn: (msg: string) => console.warn(`[WARN]  ${timestamp()} ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${timestamp()} ${msg}`),
  step: (msg: string) => console.log(`[STEP]  ${timestamp()} ▶ ${msg}`),
  pass: (msg: string) => console.log(`[PASS]  ${timestamp()} ✅ ${msg}`),
  fail: (msg: string) => console.error(`[FAIL]  ${timestamp()} ❌ ${msg}`),
};

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 23);
}

// ─── Retry utility ────────────────────────────────────────────────────────────

export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      Logger.warn(`Retry ${attempt}/${retries} after error: ${(err as Error).message}`);
      await sleep(delayMs);
    }
  }
  throw new Error('Retry exhausted');
}

// ─── Sleep ────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Random data generators ───────────────────────────────────────────────────

export function randomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function randomEmail(): string {
  return `test_${randomString(6)}@example.com`;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── File utilities ───────────────────────────────────────────────────────────

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

export function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

// ─── Environment config ───────────────────────────────────────────────────────

export const ENV = {
  baseUrl: process.env.BASE_URL ?? 'https://rahulshettyacademy.com',
  env: process.env.ENV ?? 'qa',
  headless: process.env.HEADLESS !== 'false',
  isBrowserStack: process.env.BROWSERSTACK === 'true',
  bsUsername: process.env.BROWSERSTACK_USERNAME ?? '',
  bsAccessKey: process.env.BROWSERSTACK_ACCESS_KEY ?? '',
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayFormatted(format: 'YYYY-MM-DD' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return format === 'YYYY-MM-DD' ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;
}
