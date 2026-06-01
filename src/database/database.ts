import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbFile = resolve('src', 'database', 'db.sqlite');

interface Row {
  [key: string]: any;
}

interface RunResult {
  changes: number;
  lastID: number;
}

interface PromiseDatabase {
  run(sql: string, params?: any[]): Promise<RunResult>;
  get(sql: string, params?: any[]): Promise<Row | undefined>;
  all(sql: string, params?: any[]): Promise<Row[]>;
  close(): Promise<void>;
}

function parseParams(params: any[] = []): any[] {
  return Array.isArray(params) ? params : [params];
}

function parseRow(row: any): Row | undefined {
  return row ? { ...row } : row;
}

function createPromiseDatabase(database: DatabaseSync): PromiseDatabase {
  return {
    async run(sql: string, params?: any[]): Promise<RunResult> {
      const result = database.prepare(sql).run(...parseParams(params));

      return {
        changes: result.changes as unknown as number,
        lastID: Number(result.lastInsertRowid) as unknown as number,
      };
    },

    async get(sql: string, params?: any[]): Promise<Row | undefined> {
      return parseRow(database.prepare(sql).get(...parseParams(params)));
    },

    async all(sql: string, params?: any[]): Promise<Row[]> {
      return database.prepare(sql).all(...parseParams(params)).map(parseRow).filter((row): row is Row => row !== undefined);
    },

    async close(): Promise<void> {
      database.close();
    },
  };
}

async function connect(): Promise<PromiseDatabase> {
  return createPromiseDatabase(new DatabaseSync(dbFile));
}

export default { connect };
