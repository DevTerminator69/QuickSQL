import { get } from './get';
import { set } from './set';
import Database from 'better-sqlite3';

export function mul(key: string, value: number, persistentDb: any, memoryDb: any | null): void {
  const currentValue = get(key, persistentDb, memoryDb);
  if (typeof currentValue === 'number' && typeof value === 'number') {
  const newValue = currentValue * value;
  set(key, newValue, persistentDb, memoryDb);
} else {
  throw new Error('Multiplication operation requires numeric values.');
}
}