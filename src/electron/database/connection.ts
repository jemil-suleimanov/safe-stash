import fs from 'node:fs';
import path from 'node:path';

import Database, { Database as DB } from 'better-sqlite3';
import { app } from 'electron';

const dbFileName = 'budget.db';
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, dbFileName);

let dbInstance: DB | null = null;

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

        const schemaSqlPath = path.join(__dirname, 'schema.sql');
        let schemaSql: string | null = null;

        if (fs.existsSync(schemaSqlPath)) {
            schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
            console.log('Loaded schema from relative path:', schemaSqlPath);
        } else {
            const packagedSchemaPath = app.isPackaged
                ? path.join(process.resourcesPath, 'schema.sql')
                : null;
            const devSchemaPath = path.join(process.cwd(), 'src/electron/database/schema.sql');

            if (packagedSchemaPath && fs.existsSync(packagedSchemaPath)){
                schemaSql = fs.readFileSync(packagedSchemaPath, 'utf8');
                console.log('Loaded schema from packaged resources path:', packagedSchemaPath);
            } else if (fs.existsSync(devSchemaPath)) {
                schemaSql = fs.readFileSync(devSchemaPath, 'utf8');
                console.log('Loaded schema from project root relative path:', devSchemaPath);
            } else {
                console.error(`Schema file 'schema.sql' not found at expected locations.`);
                throw new Error(`Schema file 'schema.sql' not found.`);
            }
        }

        if (schemaSql) {
            db.exec(schemaSql);
            console.log('Database schema applied successfully.');

            const seedsSqlPath = path.join(process.cwd(),'src/electron/database/seeds.sql');
            let seedsSql: string | null = null;
            if (fs.existsSync(seedsSqlPath)) {
                seedsSql = fs.readFileSync(seedsSqlPath, 'utf8');
                console.log('Loaded seeds from:', seedsSqlPath);
            } else {
                console.warn(`Seed file 'seeds.sql' not found at expected locations.`);
            }
        
        
            if (seedsSql) {
                console.log('Applying seeds...');
                db.exec(seedsSql); 
                console.log('Database seeds applied successfully.');
            }
        }

        dbInstance = db;
        console.log('Database connection established successfully.');
        return dbInstance;

    } catch (error) {
        console.error('Failed to initialize database:', error);
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