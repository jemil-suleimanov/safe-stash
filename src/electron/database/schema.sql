CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT UNIQUE,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, 
    password_hint TEXT,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    image         BLOB,
    currency_code TEXT NOT NULL,
    language_code TEXT NOT NULL,
    theme         TEXT NOT NULL CHECK (theme IN ('dark', 'light')),
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (currency_code) REFERENCES currencies(code),
    FOREIGN KEY (language_code) REFERENCES languages(code)
);

CREATE TABLE IF NOT EXISTS currencies (
    code   TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    name   TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS languages (
    code TEXT PRIMARY KEY,
    icon TEXT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS accounts (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL,
    icon_path           TEXT,
    account_type_code   TEXT NOT NULL,
    name                TEXT NOT NULL,
    start_balance_cents INTEGER DEFAULT 0,
    is_active           INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    description         TEXT,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_type_code) REFERENCES account_types(code)
);

CREATE TABLE IF NOT EXISTS account_types (
    code        TEXT PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    amount_cents             INTEGER NOT NULL,
    time                     DATETIME NOT NULL,
    type                     TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    category_id              INTEGER NOT NULL,
    account_id               INTEGER NOT NULL,
    description              TEXT,
    recipe_img               TEXT,
    generatedFromRecurringID INTEGER NULL,
    created_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (generatedFromRecurringID) REFERENCES recurring_transactions(id)
);

CREATE TABLE IF NOT EXISTS recurring_transactions (
    id                     INTEGER PRIMARY KEY AUTOINCREMENT,
    grouping_id            INTEGER NOT NULL,
    amount_cents           INTEGER NOT NULL,
    category_id            INTEGER NOT NULL,
    account_id             INTEGER NOT NULL,
    type                   TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    interval               INTEGER NOT NULL,
    frequency              TEXT CHECK (frequency IN ('DAYS', 'WEEKS', 'MONTHS', 'YEARS')) NOT NULL,
    start_date             DATETIME NOT NULL,
    end_date               DATETIME NULL,
    next_due_date          DATETIME NOT NULL,
    description            TEXT,
    contract_img           TEXT,
    created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    user_id     INTEGER NOT NULL,
    icon        TEXT,
    color       TEXT,
    description TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    user_id     INTEGER NOT NULL,
    icon        TEXT,
    color       TEXT,
    description TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transaction_tags (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    tag_id         INTEGER NOT NULL,

    UNIQUE(transaction_id, tag_id)
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS recurring_transaction_tags (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    recurring_transaction_id INTEGER NOT NULL,
    tag_id                   INTEGER NOT NULL,

    UNIQUE(recurring_transaction_id, tag_id)
    FOREIGN KEY (recurring_transaction_id) REFERENCES recurring_transactions(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS budgets (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id           INTEGER NOT NULL,
    category_id       INTEGER NOT NULL,
    limit_cents       INTEGER NOT NULL,
    period_start_date DATE NOT NULL,
    frequency         TEXT CHECK (frequency IN ('DAYS', 'WEEKS', 'MONTHS', 'YEARS')) NOT NULL,
    interval          INTEGER NOT NULL DEFAULT 1,
    color             TEXT,
    icon              TEXT,
    description       TEXT,
    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- triggers
CREATE TRIGGER IF NOT EXISTS users_updated_at_trigger
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;


CREATE TRIGGER IF NOT EXISTS account_updated_at_trigger
AFTER UPDATE ON accounts
FOR EACH ROW
BEGIN
    UPDATE accounts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS transactions_updated_at_trigger
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
    UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS recurring_transactions_updated_at_trigger
AFTER UPDATE ON recurring_transactions
FOR EACH ROW
BEGIN
    UPDATE recurring_transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS categories_updated_at_trigger
AFTER UPDATE ON categories
FOR EACH ROW
BEGIN
    UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS tags_updated_at_trigger
AFTER UPDATE ON tags
FOR EACH ROW
BEGIN
    UPDATE tags SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS budgets_updated_at_trigger
AFTER UPDATE ON budgets
FOR EACH ROW
BEGIN
    UPDATE budgets SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
