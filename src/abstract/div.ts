import { get } from './get';
import { set } from './set';
import Database from 'better-sqlite3';

export function div(key: string, value: number, persistentDb: any, memoryDb: any | null): void {
  if (value === 0) throw new Error("Cannot divide by zero");
  const currentValue = get(key, persistentDb, memoryDb) || 0;
  if (typeof currentValue === 'number' && typeof value === 'number') {
  const newValue = currentValue / value;
   set(key, newValue, persistentDb, memoryDb);
} else {
    throw new Error('Division operation requires numeric values.');
}
}