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
declare function connect(): Promise<PromiseDatabase>;
declare const _default: {
    connect: typeof connect;
};
export default _default;
//# sourceMappingURL=database.d.ts.map