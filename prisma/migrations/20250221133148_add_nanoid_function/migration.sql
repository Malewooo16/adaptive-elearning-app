-- This is an empty migration.
-- Enable pgcrypto (only needed once)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create Nano ID Function
CREATE OR REPLACE FUNCTION generate_nanoid(size INT DEFAULT 10) 
RETURNS TEXT AS $$
DECLARE
    alphabet TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    nanoid TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..size LOOP
        nanoid := nanoid || substr(alphabet, (floor(random() * length(alphabet) + 1))::INT, 1);
    END LOOP;
    RETURN nanoid;
END;
$$ LANGUAGE plpgsql;
