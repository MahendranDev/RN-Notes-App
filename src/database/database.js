// database.js
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db;

export const openDatabase = async () => {
  if (db) return db;
  try {
    db = await SQLite.openDatabase({ name: 'notes.db', location: 'default' });
    return db;
  } catch (error) {
    console.error('Failed to open database:', error);
    throw error;
  }
};

export const createTables = async () => {
  const db = await openDatabase();
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT,
      title TEXT,
      text TEXT,
      synced INTEGER
    )`
  );
};

export const insertNote = async (userId, title, text, synced) => {
  const db = await openDatabase();
  await db.executeSql(
    'INSERT INTO notes (userId, title, text, synced) VALUES (?, ?, ?, ?)',
    [userId, title, text, synced]
  );
};

export const getLocalNotes = async (userId, setNotes) => {
  const db = await openDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM notes WHERE userId = ?',
    [userId]
  );

  const notes = [];
  for (let i = 0; i < results.rows.length; i++) {
    notes.push(results.rows.item(i));
  }
  setNotes(notes);
};

export const getUnsyncedNotes = async (userId, callback) => {
  const db = await openDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM notes WHERE userId = ? AND synced = 0',
    [userId]
  );

  const unsynced = [];
  for (let i = 0; i < results.rows.length; i++) {
    unsynced.push(results.rows.item(i));
  }
  callback(unsynced);
};

export const markNoteSynced = async (noteId) => {
  const db = await openDatabase();
  await db.executeSql('UPDATE notes SET synced = 1 WHERE id = ?', [noteId]);
};
