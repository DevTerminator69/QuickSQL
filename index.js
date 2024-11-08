const { performance } = require('perf_hooks');
const { Destroyer } = require('quicksql1111111'); 

const db = new Destroyer({ 
  holdDataInMemory: true,
});

console.time('set-time');
for (let i = 0; i < 100000; i++) {
  db.set(`key${i}`, i);
}
console.timeEnd('set-time');

console.time('get-time');
for (let i = 0; i < 100000; i++) {
  db.get(`key${i}`);
}
console.timeEnd('get-time');

console.time('delete-time');
for (let i = 0; i < 100000; i++) {
  db.delete(`key${i}`);
}
console.timeEnd('delete-time');

// Add
console.time('add-time');
for (let i = 0; i < 100000; i++) {
  const value = db.get(`key${i}`) || 0;
  db.set(`key${i}`, value + 1);
}
console.timeEnd('add-time');

// Subtract
console.time('subtract-time');
for (let i = 0; i < 100000; i++) {
  const value = db.get(`key${i}`) || 0;
  db.set(`key${i}`, value - 1);
}
console.timeEnd('subtract-time');

// Multiply
console.time('multiply-time');
for (let i = 0; i < 100000; i++) {
  const value = db.get(`key${i}`) || 1;
  db.set(`key${i}`, value * 2);
}
console.timeEnd('multiply-time');

// Divide
console.time('divide-time');
for (let i = 0; i < 100000; i++) {
  const value = db.get(`key${i}`) || 1;
  db.set(`key${i}`, value / 2);
}
console.timeEnd('divide-time');
