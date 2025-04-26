import fs from 'node:fs';
import path from 'node:path';

const csvCurrencyPath = path.resolve(__dirname, '../scripts/currencies.csv');
const csvLanguagePath = path.resolve(__dirname, '../scripts/languages.csv');
const outputSqlFilePath = path.resolve(__dirname, '../src/electron/database/seeds.sql');

function parseCsvLine(line: string): string[] {
    return line.split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/'/g, "''"));
}

function generateSqlFromCsv(filePath: string, tableName: string, columns: { csvHeader: string, dbColumn: string }[]): string {
    console.log(`Processing ${filePath} for table ${tableName}...`);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}. Skipping ${tableName} seeds.`);
        return '';
    }

    const csvData = fs.readFileSync(filePath, 'utf8');
    const lines = csvData.split('\n').filter(line => line.trim() !== ''); 

    if (lines.length < 2) {
        console.warn(`No data rows found in ${filePath}.`);
        return '';
    }

    // Find column indices based on headers
    const headerLine = lines[0];
    const headers = parseCsvLine(headerLine);
    const indices: { [key: string]: number } = {};
    let columnsFound = true;
    for (const col of columns) {
        const index = headers.findIndex(h => h.toLowerCase() === col.csvHeader.toLowerCase());
        if (index === -1) {
            console.error(`Required header '${col.csvHeader}' not found in ${filePath}`);
            columnsFound = false;
        }
        indices[col.csvHeader] = index;
    }

    if (!columnsFound) {
        throw new Error(`Missing required columns in ${filePath}. Cannot generate SQL.`);
    }

    const dbColumns = columns.map(c => c.dbColumn).join(', ');
    const valuesSql: string[] = [];

    for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
        const values = parseCsvLine(lines[i]);
        const rowValues: string[] = [];
        let skipRow = false;

        for (const col of columns) {
            const value = values[indices[col.csvHeader]];
            if (value === undefined || value === null) {
                // Handle missing values - skip row or use NULL? Depends on schema
                console.warn(`Skipping row ${i+1} in ${filePath} due to missing value for ${col.csvHeader}`);
                skipRow = true;
                break;
                // rowValues.push('NULL'); // If column allows NULL
            } else {
                // Simple quoting for TEXT, numbers are fine as strings here for INSERT
                rowValues.push(`'${value}'`);
            }
        }
        if (!skipRow && rowValues.length === columns.length) {
            valuesSql.push(`(${rowValues.join(', ')})`);
        }
    }

    if (valuesSql.length > 0) {
        return `\n-- Seeds for ${tableName}\nINSERT OR IGNORE INTO ${tableName} (${dbColumns}) VALUES\n${valuesSql.join(',\n')};\n`;
    } else {
        console.log(`No valid data rows found to generate SQL for ${tableName}.`);
        return '';
    }
}

// --- Main Execution ---
try {
    let allSql = '';

    // Generate Currency Seeds
    allSql += generateSqlFromCsv(csvCurrencyPath, 'currencies', [
        { csvHeader: 'code', dbColumn: 'code' },
        { csvHeader: 'symbol', dbColumn: 'symbol' }, // Make sure 'symbol' column exists in your CSV
        { csvHeader: 'name', dbColumn: 'name' },
    ]);

    // Generate Language Seeds
    // IMPORTANT: Create Common_Languages.csv and update columns as needed
    allSql += generateSqlFromCsv(csvLanguagePath, 'languages', [
        { csvHeader: 'code', dbColumn: 'code' }, // e.g., 'en-US'
        { csvHeader: 'name', dbColumn: 'name' }, // e.g., 'English (US)'
        { csvHeader: 'icon', dbColumn: 'icon' }, // Optional, might be blank in CSV
    ]);

    // Generate Account Type Seeds (Could hardcode these if list is small/static)
    console.log("Generating Account Type seeds...");
    allSql += `
-- Seeds for account_types
INSERT OR IGNORE INTO account_types (code, name, description) VALUES
    ('CASH', 'Cash', 'Physical cash holdings'),
    ('BANK_CHK', 'Checking Account', 'Standard checking/current account'),
    ('BANK_SAV', 'Savings Account', 'Standard savings account'),
    ('CARD_CR', 'Credit Card', 'Standard credit card'),
    ('CARD_DB', 'Debit Card Account', 'Account linked to a debit card (often checking)'),
    ('INVEST', 'Investment', 'Investment or brokerage account'),
    ('LOAN', 'Loan Account', 'Mortgage, car loan, etc.'),
    ('EWALLET', 'E-Wallet', 'Digital wallet like PayPal, Venmo');
-- Add/refine as needed
`;


    if (allSql.trim()) {
        // Write to a single seeds.sql file
        fs.writeFileSync(outputSqlFilePath, allSql.trim());
        console.log(`\nSuccessfully generated seeds SQL at: ${outputSqlFilePath}`);
        console.log("ACTION REQUIRED: Ensure this seeds.sql file is executed AFTER schema.sql during database initialization.");
    } else {
        console.log('\nNo SQL generated for any seeds.');
    }

} catch (error) {
    console.error("\nError generating seed data:", error);
    process.exit(1);
}