import Database from 'better-sqlite3';
import { set } from './abstract/set';
import { get } from './abstract/get';
import { deleteCommand } from './abstract/delete';
import { add } from './abstract/add';
import { sub } from './abstract/sub';
import { mul } from './abstract/mul';
import { div } from './abstract/div';
import { ping } from './abstract/ping';
import { clear } from './abstract/clear';

interface QuickSQLOptions {
  filepath?: string;
  holdDataInMemory?: boolean;
}

class QuickSQL {
  private persistentDb: any;
  private memoryDb: any | null;

  constructor(options: QuickSQLOptions = {}) {
    const { filepath = 'Database.db', holdDataInMemory = true } = options;
    this.persistentDb = new Database(filepath);
    this.persistentDb.pragma('journal_mode = WAL');
    this.memoryDb = holdDataInMemory ? new Database(':memory:') : null;
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS json (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `;
    
    this.persistentDb.exec(createTableSQL);
    
    if (this.memoryDb) {
      this.memoryDb.exec(createTableSQL);
      this.loadDataToMemory();
    }
  }

  private loadDataToMemory(): void {
    if (!this.memoryDb) return;
    const rows = this.persistentDb.prepare('SELECT key, value FROM json').all();
    const insert = this.memoryDb.prepare('INSERT OR REPLACE INTO json (key, value) VALUES (?, ?)');
    const transaction = this.memoryDb.transaction((rows: Array<{ key: string, value: string }>) => {
      rows.forEach(row => {
        insert.run(row.key, row.value);
      });
    });
    transaction(rows);
  }

  public set(key: string, value: any): void {
    set(key, value, this.persistentDb, this.memoryDb);
  }

  public get<T>(key: string): T | null {
    return get<T>(key, this.persistentDb, this.memoryDb);
  }

  public delete(key: string): void {
    deleteCommand(key, this.persistentDb, this.memoryDb);
  }

  public add(key: string, value: number): void {
    add(key, value, this.persistentDb, this.memoryDb);
  }

  public sub(key: string, value: number): void {
    sub(key, value, this.persistentDb, this.memoryDb);
  }

  public mul(key: string, value: number): void {
    mul(key, value, this.persistentDb, this.memoryDb);
  }

  public div(key: string, value: number): void {
    div(key, value, this.persistentDb, this.memoryDb);
  }

  public ping(): { writeDuration: number; readDuration: number; deleteDuration: number } {
    return ping(this.persistentDb, this.memoryDb);
  }

  public clear(): boolean {
    return clear(this.persistentDb, this.memoryDb);
  }
}

export { QuickSQL };
