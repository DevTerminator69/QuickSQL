import { get } from './get';
import { set } from './set';

export function add(key: string, value: number, persistentDb: any, memoryDb: any | null): void {
  const currentValue = get(key, persistentDb, memoryDb);
  
  const newValue = typeof currentValue === 'number' ? currentValue + value : (typeof currentValue === 'undefined' ? value : null);
  
  if (typeof newValue !== 'number') {
    throw new Error(`Add operation requires a numeric value. The current value for "${key}" is not a number.`);
  }

  set(key, newValue, persistentDb, memoryDb);
}
