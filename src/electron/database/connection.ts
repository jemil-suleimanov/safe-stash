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
    console.log(`__dirname (connection.ts): ${__dirname}`); // Where connection.ts is located after build

    let basePath: string;

    if (app.isPackaged) {
        const packagedPath = path.join(process.resourcesPath, fileName); // <<<< CHANGE HERE
        console.log(`Packaged App: Attempting to load ${fileName} from (root of resources): ${packagedPath}`);
        if (fs.existsSync(packagedPath)) {
            console.log(`Successfully found ${fileName} at: ${packagedPath}`);
            return packagedPath;
        } else {
            // Fallback: Try 'database' subdirectory just in case config was like Option 1
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
        // In development:
        // Option 1: Relative to the compiled output of this file (connection.ts)
        // If connection.ts is compiled to .vite/build/database/connection.js
        // and schema.sql is at .vite/build/database/schema.sql
        // This path might be like path.join(__dirname, fileName)
        // OR
        // Option 2: Relative to the project root's src/electron/database directory
        // This is more common if you're not copying them during dev build to .vite
        basePath = path.join(__dirname); // Default for dev, assuming files are copied next to compiled connection.js
        // OR explicitly use project structure:
        // basePath = path.resolve(process.cwd(), 'src/electron/database');
        // OR if Vite copies it to dist-electron:
        // basePath = path.resolve(app.getAppPath(), 'dist-electron/database');

        // Let's make development path more robust by checking common dev locations
        // relative to where this file (connection.ts) is located AFTER compilation by Vite for main.
        // Vite for main process usually outputs to a structure like `dist-electron` or `.vite/build`.
        // If schema.sql is alongside connection.ts in the source `src/electron/database`
        // and your build process copies them together to the output directory.

        // Path 1: Files are copied next to the compiled connection.js by Vite/Forge
        // (e.g., .vite/build/database/schema.sql if connection.js is in .vite/build/database/)
        const devPath1 = path.join(__dirname, fileName);
        if (fs.existsSync(devPath1)) {
            console.log(`Found ${fileName} via devPath1: ${devPath1}`);
            return devPath1;
        }

        // Path 2: Files are in a 'database' subfolder relative to compiled output of main.js itself
        // (e.g., if main.js is in .vite/build/main.js, and files are in .vite/build/database/schema.sql)
        // This assumes `main.ts` and `database/connection.ts` are structured in a way that
        // `__dirname` of `connection.ts` makes sense relative to where `main.ts`'s `__dirname` is.
        // This gets tricky. The most reliable dev path often involves `app.getAppPath()` if Vite
        // outputs to a predictable `dist-electron` structure that `app.getAppPath()` points to in dev.
        const devPath2 = path.join(app.getAppPath(), 'dist-electron', 'database', fileName);
        if (fs.existsSync(devPath2)) {
            console.log(`Found ${fileName} via devPath2 (dist-electron): ${devPath2}`);
            return devPath2;
        }

        // Path 3: Absolute path from project root (less ideal for packaged, but good fallback for dev)
        // This assumes you run `electron-forge start` from the project root.
        const devPath3 = path.resolve(process.cwd(), 'src/electron/database', fileName);
        if (fs.existsSync(devPath3)) {
            console.log(`Found ${fileName} via devPath3 (project root): ${devPath3}`);
            return devPath3;
        }

        // If none of the specific dev paths worked, throw an error for development
        console.error(`${fileName} not found in common development locations. Checked: ${devPath1}, ${devPath2}, ${devPath3}`);
        throw new Error(`DEV: Database ${fileName} file could not be located.`);
    }

    const filePath = path.join(basePath, fileName);
    console.log(`Attempting to load ${fileName} from: ${filePath}`);

    if (fs.existsSync(filePath)) {
        console.log(`Successfully found ${fileName} at: ${filePath}`);
        return filePath;
    } else {
        // Log all paths that were constructed and attempted if in dev mode for easier debugging
        if (!app.isPackaged) {
            // This part of the logic is now covered by the specific dev path checks above.
        }
        console.error(`${fileName} not found. Attempted packaged path: ${filePath}. Base path was: ${basePath}`);
        throw new Error(`Database ${fileName} file could not be located. Ensure it's copied to the 'database' directory within your application resources for packaged apps, or available in development build output.`);
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
