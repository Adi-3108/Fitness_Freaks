-- View User Diet Plan Data
-- This script shows the data stored in the user_diet_plan table

-- Show all diet plans
SELECT 
    id,
    user_id,
    diet_category,
    meals_json
FROM user_diet_plan
ORDER BY user_id, id;

-- Show count of diet plans by category
SELECT 
    diet_category,
    COUNT(*) as plan_count
FROM user_diet_plan
GROUP BY diet_category;

-- Show users and their selected diet plans
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    udp.diet_category,
    udp.id as diet_plan_id
FROM user u
LEFT JOIN user_diet_plan udp ON u.id = udp.user_id
ORDER BY u.id;

-- Show detailed meal information (formatted)
SELECT 
    udp.id,
    udp.user_id,
    udp.diet_category,
    JSON_EXTRACT(udp.meals_json, '$.breakfast') as breakfast_meals,
    JSON_EXTRACT(udp.meals_json, '$.lunch') as lunch_meals,
    JSON_EXTRACT(udp.meals_json, '$.dinner') as dinner_meals,
    JSON_EXTRACT(udp.meals_json, '$.snacks') as snack_meals
FROM user_diet_plan udp
ORDER BY udp.user_id; 