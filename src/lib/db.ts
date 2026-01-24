export interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch<T = any>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = any>(column?: string): Promise<T | null>;
    run<T = any>(): Promise<D1Result<T>>;
    all<T = any>(): Promise<D1Result<T>>;
    raw<T = any>(): Promise<T[]>;
}

export interface D1Result<T = any> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: {
        duration: number;
        rows_read: number;
        rows_written: number;
        last_row_id: number | null;
        changed_db: boolean;
        size_after: number;
        rows_before: number;
    };
}

export interface D1ExecResult {
    count: number;
    duration: number;
}

// Local SQLite implementation that matches D1 interface
class LocalDB implements D1Database {
    private db: any;

    constructor(dbPath: string) {
        // Dynamic import to avoid bundling in production
        const { DatabaseSync } = require('node:sqlite');
        const fs = require('node:fs');
        const path = require('node:path');
        
        this.db = new DatabaseSync(dbPath);
        this.init(fs, path);
    }

    private init(fs: any, path: any) {
        // Run migrations if file exists
        const migrationsPath = path.join(process.cwd(), 'migrations', '0000_initial.sql');
        if (fs.existsSync(migrationsPath)) {
            const sql = fs.readFileSync(migrationsPath, 'utf8');
            this.db.exec(sql);
        }
    }

    prepare(query: string): D1PreparedStatement {
        const stmt = this.db.prepare(query);
        return new LocalStatement(stmt);
    }

    async batch<T = any>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
        const results: D1Result<T>[] = [];
        for (const stmt of statements) {
            results.push(await stmt.run());
        }
        return results;
    }

    async exec(query: string): Promise<D1ExecResult> {
        const start = Date.now();
        this.db.exec(query);
        return {
            count: 0, // DatabaseSync.exec doesn't return count easily
            duration: Date.now() - start
        };
    }
}

class LocalStatement implements D1PreparedStatement {
    private values: any[] = [];

    constructor(private stmt: any) {}

    bind(...values: any[]): D1PreparedStatement {
        this.values = values.map(v => typeof v === 'boolean' ? (v ? 1 : 0) : v);
        return this;
    }

    async first<T = any>(column?: string): Promise<T | null> {
        const result = this.stmt.get(...this.values) as any;
        if (!result) return null;
        return column ? result[column] : result;
    }

    async run<T = any>(): Promise<D1Result<T>> {
        const start = Date.now();
        const info = this.stmt.run(...this.values);
        return {
            success: true,
            meta: {
                duration: Date.now() - start,
                rows_read: 0,
                rows_written: info.changes,
                last_row_id: info.lastInsertRowid,
                changed_db: info.changes > 0,
                size_after: 0,
                rows_before: 0
            }
        };
    }

    async all<T = any>(): Promise<D1Result<T>> {
        const start = Date.now();
        const results = this.stmt.all(...this.values) as T[];
        return {
            results,
            success: true,
            meta: {
                duration: Date.now() - start,
                rows_read: results.length,
                rows_written: 0,
                last_row_id: null,
                changed_db: false,
                size_after: 0,
                rows_before: 0
            }
        };
    }

    async raw<T = any>(): Promise<T[]> {
        const result = await this.all<T>();
        return (result.results || []).map(r => Object.values(r as any) as T);
    }
}

let localDbInstance: LocalDB | null = null;

// Helper to get DB binding
export function getDB(locals: any): D1Database {
    // Check for D1 binding (production on Cloudflare)
    if (locals?.runtime?.env?.quiz_db) {
        return locals.runtime.env.quiz_db;
    }
    
    // Fallback to local SQLite for development
    if (!localDbInstance) {
        localDbInstance = new LocalDB('quiz.db');
    }
    return localDbInstance;
}

