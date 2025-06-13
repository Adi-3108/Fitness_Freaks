-- Detailed Diet Plan View
-- This creates a more readable view of the diet plan data

-- Create a view for better meal breakdown
CREATE OR REPLACE VIEW diet_plan_details AS
SELECT 
    udp.id as diet_plan_id,
    udp.user_id,
    udp.diet_category,
    'breakfast' as meal_type,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.item')) as meal_name,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.calories')) as calories,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.img')) as image_url
FROM user_diet_plan udp,
     JSON_TABLE(udp.meals_json, '$.breakfast[*]' COLUMNS (item JSON PATH '$')) as meal

UNION ALL

SELECT 
    udp.id as diet_plan_id,
    udp.user_id,
    udp.diet_category,
    'lunch' as meal_type,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.item')) as meal_name,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.calories')) as calories,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.img')) as image_url
FROM user_diet_plan udp,
     JSON_TABLE(udp.meals_json, '$.lunch[*]' COLUMNS (item JSON PATH '$')) as meal

UNION ALL

SELECT 
    udp.id as diet_plan_id,
    udp.user_id,
    udp.diet_category,
    'dinner' as meal_type,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.item')) as meal_name,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.calories')) as calories,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.img')) as image_url
FROM user_diet_plan udp,
     JSON_TABLE(udp.meals_json, '$.dinner[*]' COLUMNS (item JSON PATH '$')) as meal

UNION ALL

SELECT 
    udp.id as diet_plan_id,
    udp.user_id,
    udp.diet_category,
    'snacks' as meal_type,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.item')) as meal_name,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.calories')) as calories,
    JSON_UNQUOTE(JSON_EXTRACT(meal.item, '$.img')) as image_url
FROM user_diet_plan udp,
     JSON_TABLE(udp.meals_json, '$.snacks[*]' COLUMNS (item JSON PATH '$')) as meal;

-- Query the detailed view
SELECT 
    dpd.diet_plan_id,
    dpd.user_id,
    dpd.diet_category,
    dpd.meal_type,
    dpd.meal_name,
    dpd.calories,
    dpd.image_url
FROM diet_plan_details dpd
ORDER BY dpd.user_id, dpd.diet_category, 
         CASE dpd.meal_type 
             WHEN 'breakfast' THEN 1 
             WHEN 'lunch' THEN 2 
             WHEN 'dinner' THEN 3 
             WHEN 'snacks' THEN 4 
         END;

-- Summary by user and diet category
SELECT 
    user_id,
    diet_category,
    COUNT(*) as total_meals,
    SUM(CAST(calories AS UNSIGNED)) as total_calories,
    COUNT(DISTINCT meal_type) as meal_types
FROM diet_plan_details
GROUP BY user_id, diet_category
ORDER BY user_id; 