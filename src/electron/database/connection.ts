import fs from 'node:fs';
import path from 'node:path';

import Database, { Database as DB } from 'better-sqlite3';
import { app } from 'electron';

const dbFileName = 'budget.db';
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, dbFileName);

let dbInstance: DB | null = null;

function findRequiredFilePath(fileName: 'schema.sql' | 'seeds.sql'): string {
    console.log(`Searching for ${fileName}...`);
    console.log(`app.isPackaged: ${app.isPackaged}`);
    console.log(`process.resourcesPath: ${process.resourcesPath}`);
    console.log(`app.getAppPath(): ${app.getAppPath()}`);
    console.log(`__dirname (connection.ts): ${__dirname}`);

    if (app.isPackaged) {
        const packagedPath = path.join(process.resourcesPath, fileName);
        console.log(`Packaged App: Attempting to load ${fileName} from (root of resources): ${packagedPath}`);
        if (fs.existsSync(packagedPath)) {
            console.log(`Successfully found ${fileName} at: ${packagedPath}`);
            return packagedPath;
        } else {
            const packagedPathSubdir = path.join(process.resourcesPath, 'database', fileName);
            console.log(`Packaged App: Attempting to load ${fileName} from (database subdir of resources): ${packagedPathSubdir}`);
            if (fs.existsSync(packagedPathSubdir)) {
                console.log(`Successfully found ${fileName} at: ${packagedPathSubdir}`);
                return packagedPathSubdir;
            }
            console.error(`${fileName} not found in packaged app resources. Checked root and 'database' subdirectory.`);
            throw new Error(`Database ${fileName} file could not be located in packaged app resources.`);
        }
    } else {

        const devPath1 = path.join(__dirname, fileName);
        if (fs.existsSync(devPath1)) {
            console.log(`Found ${fileName} via devPath1: ${devPath1}`);
            return devPath1;
        }

        const devPath2 = path.join(app.getAppPath(), 'dist-electron', 'database', fileName);
        if (fs.existsSync(devPath2)) {
            console.log(`Found ${fileName} via devPath2 (dist-electron): ${devPath2}`);
            return devPath2;
        }

        const devPath3 = path.resolve(process.cwd(), 'src/electron/database', fileName);
        if (fs.existsSync(devPath3)) {
            console.log(`Found ${fileName} via devPath3 (project root): ${devPath3}`);
            return devPath3;
        }

        console.error(`${fileName} not found in common development locations. Checked: ${devPath1}, ${devPath2}, ${devPath3}`);
        throw new Error(`DEV: Database ${fileName} file could not be located.`);
    }

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
