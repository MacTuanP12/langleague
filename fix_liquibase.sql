-- Fix failed Liquibase migration
-- Run this SQL script in your MySQL database to clean up the failed migration

-- Remove the failed changeset from Liquibase tracking table
DELETE FROM DATABASECHANGELOGLOCK WHERE ID = 1;

-- Remove the failed changeset entry (if it exists)
DELETE FROM DATABASECHANGELOG
WHERE ID = '20260117000000-1'
AND AUTHOR = 'system'
AND FILENAME LIKE '%20260117000000_increase_imageurl_size.xml%';

-- Verify the cleanup
SELECT * FROM DATABASECHANGELOG WHERE ID = '20260117000000-1';
