interface Database {
    prepare(query: string): {
      get(key: string): { value: string } | undefined;
    };
  }
  
  export function get<T>(key: string, persistentDb: Database, memoryDb: Database | null): T | null {
    let row;
    
    if (memoryDb) {
      row = memoryDb.prepare('SELECT value FROM json WHERE key = ?').get(key);
    } else {
      row = persistentDb.prepare('SELECT value FROM json WHERE key = ?').get(key);
    }
  
    return row ? JSON.parse(row.value) : null;
  }
  