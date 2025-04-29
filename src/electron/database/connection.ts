import fs from 'node:fs';
import path from 'node:path';

import Database, { Database as DB } from 'better-sqlite3';
import { app } from 'electron';

const dbFileName = 'budget.db';
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, dbFileName);

let dbInstance: DB | null = null;

function findRequiredFilePath(fileName: 'schema.sql' | 'seeds.sql'): string {
    const possiblePaths = [
        // Path when packaged (assuming build copies them to resources/database)
        app.isPackaged ? path.join(process.resourcesPath, 'database', fileName) : null,
        // Path for development (relative to __dirname - might vary based on bundler output)
        path.join(__dirname, fileName),
        // Common location with Vite plugin (dist-electron/database)
        path.join(app.getAppPath(), 'dist-electron/database', fileName),
        // Fallback relative to project root (useful for running ts-node etc.)
        path.join(process.cwd(), 'src/electron/database', fileName),
    ].filter(p => p !== null) as string[];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            console.log(`Found ${fileName} file at: ${p}`);
            return p;
        }
    }

    console.error(`${fileName} file not found in expected locations:`, possiblePaths);
    throw new Error(`Database ${fileName} file could not be located. Ensure it's generated and copied correctly.`);
}

function applySeedDataIfNeeded(db: DB): void {
    console.log('Checking if seed data needs to be applied...');

    try {
        const currencyCountStmt = db.prepare('SELECT COUNT(*) as count FROM currencies');
        const currencyCount = currencyCountStmt.get() as { count: number };

        if (currencyCount.count === 0) {
            console.log('Core reference data (currencies) table is empty. Attempting to apply seeds...');

            const seedsSqlPath = findRequiredFilePath('seeds.sql');
            const seedsSql = fs.readFileSync(seedsSqlPath, 'utf8');

            if (seedsSql.trim()) {
                console.log(`Executing SQL from ${seedsSqlPath}...`);
                db.exec(seedsSql); // Execute the entire seed script
                console.log('Seed script executed successfully.');
            } else {
                console.warn(`Seed script file (${seedsSqlPath}) is empty. No seed data applied.`);
            }
        } else {
            console.log('Core reference data (currencies) table is populated. Skipping seed script execution.');
        }
    } catch (error) {
        // Handle errors during count check, file read, or SQL execution
        console.error('Error during seed data application:', error);
        // Depending on severity, you might want to throw or just log
        // If seed data is critical for startup, throwing might be appropriate.
        throw new Error(`Failed to apply seed data: ${error}`);
    }
}

function initializeDatabase(): DB {
    if (dbInstance) {
        console.warn('Database already initialized.');
        return dbInstance;
    }

    console.log(`Initializing database at: ${dbPath}`);

    try {
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }

        const db = new Database(dbPath);

        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        console.log('Database pragmas set (WAL mode, Foreign Keys ON).');

        const schemaSqlPath = findRequiredFilePath('schema.sql');
        const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
        db.exec(schemaSql);

        applySeedDataIfNeeded(db);

        dbInstance = db;
        console.log('Database connection established successfully.');
        return dbInstance;

    } catch (error) {
        console.error('Failed to initialize database:', error);
        dbInstance = null;
        throw error;
    }
}

function getDatabaseInstance(): DB {
    if (!dbInstance) {
        console.error('Database accessed before initialization or initialization failed!');
        throw new Error('Database not initialized');
    }
    return dbInstance;
}

function closeDatabase(): void {
    if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
        console.log('Database connection closed.');
    } else {
        console.warn('Attempted to close database, but connection was not open.');
    }
}


export { closeDatabase,getDatabaseInstance, initializeDatabase };

export type SqliteDB = DB;
