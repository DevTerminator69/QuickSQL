import Database from 'better-sqlite3';

export function deleteCommand(key: string, persistentDb: any, memoryDb: any | null): void {
    persistentDb.prepare('DELETE FROM json WHERE key = ?').run(key);
    if (memoryDb) {
      memoryDb.prepare('DELETE FROM json WHERE key = ?').run(key);
    }
  }
  