-- Footer Analytics Queries
-- Use these queries to analyze footer interactions and user behavior

-- View all footer analytics data
SELECT 
    id,
    action,
    target,
    user_ip,
    page_url,
    clicked_at
FROM footer_analytics
ORDER BY clicked_at DESC;

-- Get total clicks by action type
SELECT 
    action,
    COUNT(*) as click_count
FROM footer_analytics
GROUP BY action
ORDER BY click_count DESC;

-- Get total clicks by target (social media platforms, etc.)
SELECT 
    target,
    COUNT(*) as click_count
FROM footer_analytics
GROUP BY target
ORDER BY click_count DESC;

-- Get social media click statistics
SELECT 
    target,
    COUNT(*) as clicks,
    DATE(clicked_at) as click_date
FROM footer_analytics
WHERE target IN ('facebook', 'instagram', 'linkedin')
GROUP BY target, DATE(clicked_at)
ORDER BY click_date DESC, clicks DESC;

-- Get newsletter subscription analytics
SELECT 
    action,
    COUNT(*) as subscriptions,
    DATE(clicked_at) as subscription_date
FROM footer_analytics
WHERE action = 'newsletter_subscribe'
GROUP BY action, DATE(clicked_at)
ORDER BY subscription_date DESC;

-- Get contact form submission analytics
SELECT 
    action,
    COUNT(*) as submissions,
    DATE(clicked_at) as submission_date
FROM footer_analytics
WHERE action = 'contact_form'
GROUP BY action, DATE(clicked_at)
ORDER BY submission_date DESC;

-- Get hourly distribution of footer interactions
SELECT 
    HOUR(clicked_at) as hour_of_day,
    COUNT(*) as interactions
FROM footer_analytics
GROUP BY HOUR(clicked_at)
ORDER BY hour_of_day;

-- Get daily footer interaction trends
SELECT 
    DATE(clicked_at) as interaction_date,
    COUNT(*) as total_interactions,
    COUNT(CASE WHEN action = 'social_click' THEN 1 END) as social_clicks,
    COUNT(CASE WHEN action = 'newsletter_subscribe' THEN 1 END) as newsletter_subscriptions,
    COUNT(CASE WHEN action = 'contact_form' THEN 1 END) as contact_forms
FROM footer_analytics
GROUP BY DATE(clicked_at)
ORDER BY interaction_date DESC;

-- Get most active pages for footer interactions
SELECT 
    page_url,
    COUNT(*) as interactions
FROM footer_analytics
GROUP BY page_url
ORDER BY interactions DESC;

-- Get user agent statistics (browser/device info)
SELECT 
    user_agent,
    COUNT(*) as usage_count
FROM footer_analytics
GROUP BY user_agent
ORDER BY usage_count DESC
LIMIT 10;

-- Clean up old analytics data (older than 30 days)
-- DELETE FROM footer_analytics WHERE clicked_at < DATE_SUB(NOW(), INTERVAL 30 DAY); 