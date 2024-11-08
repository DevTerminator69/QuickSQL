import Database from 'better-sqlite3';

export function ping(persistentDb: any, memoryDb: any | null): { writeDuration: number; readDuration: number; deleteDuration: number } {
    const testKey = 'pingTestKey';
    const testValue = { test: 'value' };
  
    const writeStartTime = process.hrtime();
    persistentDb.prepare('INSERT OR REPLACE INTO json (key, value) VALUES (?, ?)').run(testKey, JSON.stringify(testValue));
    if (memoryDb) {
      memoryDb.prepare('INSERT OR REPLACE INTO json (key, value) VALUES (?, ?)').run(testKey, JSON.stringify(testValue));
    }
    const writeEndTime = process.hrtime(writeStartTime);
    const writeDuration = (writeEndTime[0] * 1e9 + writeEndTime[1]) / 1e6;
  
    const readStartTime = process.hrtime();
    persistentDb.prepare('SELECT value FROM json WHERE key = ?').get(testKey);
    if (memoryDb) {
      memoryDb.prepare('SELECT value FROM json WHERE key = ?').get(testKey);
    }
    const readEndTime = process.hrtime(readStartTime);
    const readDuration = (readEndTime[0] * 1e9 + readEndTime[1]) / 1e6;
  
    const deleteStartTime = process.hrtime();
    persistentDb.prepare('DELETE FROM json WHERE key = ?').run(testKey);
    if (memoryDb) {
      memoryDb.prepare('DELETE FROM json WHERE key = ?').run(testKey);
    }
    const deleteEndTime = process.hrtime(deleteStartTime);
    const deleteDuration = (deleteEndTime[0] * 1e9 + deleteEndTime[1]) / 1e6;
  
    return { writeDuration, readDuration, deleteDuration };
  }
  