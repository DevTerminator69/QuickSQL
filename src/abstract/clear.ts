
export function clear(persistentDb: any, memoryDb: any | null): boolean {
    persistentDb.prepare('DELETE FROM json').run();
    if (memoryDb) {
      memoryDb.prepare('DELETE FROM json').run();
    }
    return true;
  }
  