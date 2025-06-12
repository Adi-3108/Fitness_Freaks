-- Simple check for diet plan data
-- Run this first to see if there's any data in the table

-- Check if table exists and has data
SELECT COUNT(*) as total_diet_plans FROM user_diet_plan;

-- Show basic table structure
DESCRIBE user_diet_plan;

-- Show all records (if any exist)
SELECT * FROM user_diet_plan;

-- Show table creation info
SHOW CREATE TABLE user_diet_plan; 