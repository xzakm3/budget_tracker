-- Budget Tracker Database Schema
-- Schema: temp_andantino

CREATE SCHEMA IF NOT EXISTS temp_andantino;

-- Categories table
CREATE TABLE IF NOT EXISTS temp_andantino.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS temp_andantino.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD')),
    date DATE NOT NULL,
    note TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
    category_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES temp_andantino.categories(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON temp_andantino.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON temp_andantino.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON temp_andantino.transactions(date);
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON temp_andantino.categories(deleted_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION temp_andantino.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON temp_andantino.categories 
    FOR EACH ROW EXECUTE FUNCTION temp_andantino.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON temp_andantino.transactions 
    FOR EACH ROW EXECUTE FUNCTION temp_andantino.update_updated_at_column();