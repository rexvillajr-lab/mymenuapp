declare module 'react-native-sqlite-storage' {
  export type ResultSet = {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => Record<string, unknown>;
    };
  };

  export type Transaction = {
    executeSql: (
      sqlStatement: string,
      args?: unknown[],
      callback?: (transaction: Transaction, resultSet: ResultSet) => void,
      errorCallback?: (error: Error) => boolean | void,
    ) => void;
  };

  export type SQLiteDatabase = {
    transaction: (
      scope: (transaction: Transaction) => void,
      error?: (error: Error) => void,
      success?: () => void,
    ) => void;
  };

  type SQLiteStatic = {
    DEBUG: (enabled: boolean) => void;
    enablePromise: (enabled: boolean) => void;
    openDatabase: (
      params: {name: string; location?: string},
      success: (database: SQLiteDatabase) => void,
      error: (error: Error) => void,
    ) => SQLiteDatabase;
  };

  const SQLite: SQLiteStatic;
  export default SQLite;
}
