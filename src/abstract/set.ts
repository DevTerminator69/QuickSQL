interface Database {
    prepare(query: string): {
      run(key: string, value: string): void;
    };
  }
  
  export function set(key: string, value: any, persistentDb: Database, memoryDb: Database | null): void {
    const serializedValue = JSON.stringify(value);
    persistentDb.prepare('INSERT OR REPLACE INTO json (key, value) VALUES (?, ?)').run(key, serializedValue);
    
    if (memoryDb) {
      memoryDb.prepare('INSERT OR REPLACE INTO json (key, value) VALUES (?, ?)').run(key, serializedValue);
    }
  }
  