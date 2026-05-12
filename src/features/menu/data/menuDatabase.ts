import SQLite, {ResultSet, SQLiteDatabase} from 'react-native-sqlite-storage';

import {MenuItem, Order, OrderLine} from '../types/models';

SQLite.enablePromise(false);

type MenuItemInput = {
  name: string;
  price: number;
};

const legacySeedItemNames = [
  'Classic Burger',
  'Chicken Rice Bowl',
  'Garden Salad',
  'Iced Tea',
];

let database: SQLiteDatabase | null = null;

const openDatabase = () =>
  new Promise<SQLiteDatabase>((resolve, reject) => {
    if (database) {
      resolve(database);
      return;
    }

    SQLite.openDatabase(
      {name: 'my_menu_app.db', location: 'default'},
      db => {
        database = db;
        resolve(db);
      },
      reject,
    );
  });

const executeSql = (
  db: SQLiteDatabase,
  sql: string,
  params: unknown[] = [],
) =>
  new Promise<ResultSet>((resolve, reject) => {
    const onError = (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error && 'message' in error
            ? String(error.message)
            : 'SQLite query failed.';

      reject(new Error(message));
    };

    db.transaction(
      tx => {
        tx.executeSql(
          sql,
          params,
          (_tx, result) => resolve(result),
          error => {
            onError(error);
            return false;
          },
        );
      },
      onError,
    );
  });

const resultRows = <T>(result: ResultSet) => {
  const rows: T[] = [];

  for (let index = 0; index < result.rows.length; index += 1) {
    const row = result.rows.item(index);

    if (row) {
      rows.push(row as T);
    }
  }

  return rows;
};

const getTableColumns = async (db: SQLiteDatabase, tableName: string) => {
  const result = await executeSql(db, `PRAGMA table_info(${tableName});`);
  return resultRows<{name: string}>(result).map(column => column.name);
};

const ensureColumn = async (
  db: SQLiteDatabase,
  tableName: string,
  columnName: string,
  columnDefinition: string,
) => {
  const columns = await getTableColumns(db, tableName);

  if (!columns.includes(columnName)) {
    await executeSql(
      db,
      `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition};`,
    );
  }
};

export const initializeDatabase = async () => {
  const db = await openDatabase();

  await executeSql(
    db,
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
  );

  await ensureColumn(db, 'menu_items', 'created_at', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn(db, 'menu_items', 'updated_at', "TEXT NOT NULL DEFAULT ''");

  const timestamp = new Date().toISOString();
  await executeSql(
    db,
    "UPDATE menu_items SET created_at = ? WHERE created_at = '';",
    [timestamp],
  );
  await executeSql(
    db,
    "UPDATE menu_items SET updated_at = ? WHERE updated_at = '';",
    [timestamp],
  );

  await executeSql(
    db,
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      total REAL NOT NULL
    );`,
  );

  await executeSql(
    db,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id)
    );`,
  );

  await executeSql(
    db,
    `DELETE FROM menu_items
    WHERE name IN (?, ?, ?, ?)
    AND description = ''
    AND NOT EXISTS (SELECT 1 FROM order_items WHERE menu_item_id = menu_items.id);`,
    legacySeedItemNames,
  );
};

export const getMenuItems = async () => {
  const db = await openDatabase();
  const result = await executeSql(
    db,
    `SELECT
      id,
      name,
      price,
      created_at as createdAt,
      updated_at as updatedAt
    FROM menu_items
    ORDER BY name ASC;`,
  );

  return resultRows<MenuItem>(result);
};

export const addMenuItem = async ({name, price}: MenuItemInput) => {
  const db = await openDatabase();
  const timestamp = new Date().toISOString();
  const itemName = name.trim();
  const result = await executeSql(
    db,
    `INSERT INTO menu_items
      (name, description, price, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?);`,
    [itemName, '', price, timestamp, timestamp],
  );
  const id = Number(result.insertId);

  if (!Number.isFinite(id)) {
    throw new Error('SQLite did not return an inserted item id.');
  }

  return {
    id,
    name: itemName,
    price,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const updateMenuItem = async (
  id: number,
  {name, price}: MenuItemInput,
) => {
  const db = await openDatabase();
  const timestamp = new Date().toISOString();

  await executeSql(
    db,
    `UPDATE menu_items
    SET name = ?, price = ?, updated_at = ?
    WHERE id = ?;`,
    [name.trim(), price, timestamp, id],
  );
};

export const deleteMenuItem = async (id: number) => {
  const db = await openDatabase();

  await executeSql(db, 'DELETE FROM menu_items WHERE id = ?;', [id]);
};

export const createOrder = async (
  lines: {item: MenuItem; quantity: number}[],
) => {
  const db = await openDatabase();
  const createdAt = new Date().toISOString();
  const total = lines.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );

  const orderResult = await executeSql(
    db,
    'INSERT INTO orders (created_at, total) VALUES (?, ?);',
    [createdAt, total],
  );
  const orderId = Number(orderResult.insertId);

  await Promise.all(
    lines.map(line =>
      executeSql(
        db,
        `INSERT INTO order_items
          (order_id, menu_item_id, name, price, quantity)
        VALUES (?, ?, ?, ?, ?);`,
        [orderId, line.item.id, line.item.name, line.item.price, line.quantity],
      ),
    ),
  );

  return orderId;
};

export const getOrders = async () => {
  const db = await openDatabase();
  const ordersResult = await executeSql(
    db,
    'SELECT id, created_at as createdAt, total FROM orders ORDER BY id DESC;',
  );
  const orders = resultRows<Omit<Order, 'items'>>(ordersResult);

  const orderLines = await Promise.all(
    orders.map(async order => {
      const linesResult = await executeSql(
        db,
        `SELECT
          id,
          order_id as orderId,
          menu_item_id as menuItemId,
          name,
          price,
          quantity
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC;`,
        [order.id],
      );

      return [order.id, resultRows<OrderLine>(linesResult)] as const;
    }),
  );

  const linesByOrderId = new Map(orderLines);

  return orders.map(order => ({
    ...order,
    items: linesByOrderId.get(order.id) ?? [],
  }));
};
