-- Newsletter and Contact Form Management Queries
-- Use these queries to manage subscribers and contact messages

-- ===== NEWSLETTER SUBSCRIBERS =====

-- View all newsletter subscribers
SELECT 
    id,
    name,
    email,
    subscribed_at,
    is_active,
    unsubscribed_at
FROM newsletter_subscribers
ORDER BY subscribed_at DESC;

-- View active subscribers only
SELECT 
    id,
    name,
    email,
    subscribed_at
FROM newsletter_subscribers
WHERE is_active = true
ORDER BY subscribed_at DESC;

-- View unsubscribed users
SELECT 
    id,
    name,
    email,
    subscribed_at,
    unsubscribed_at
FROM newsletter_subscribers
WHERE is_active = false
ORDER BY unsubscribed_at DESC;

-- Get subscriber count by status
SELECT 
    is_active,
    COUNT(*) as count
FROM newsletter_subscribers
GROUP BY is_active;

-- Get subscribers who joined in the last 30 days
SELECT 
    name,
    email,
    subscribed_at
FROM newsletter_subscribers
WHERE subscribed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
AND is_active = true
ORDER BY subscribed_at DESC;

-- Get subscribers who unsubscribed in the last 30 days
SELECT 
    name,
    email,
    subscribed_at,
    unsubscribed_at
FROM newsletter_subscribers
WHERE unsubscribed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY unsubscribed_at DESC;

-- ===== CONTACT MESSAGES =====

-- View all contact messages
SELECT 
    id,
    name,
    email,
    subject,
    message,
    created_at,
    is_read,
    read_at
FROM contact_messages
ORDER BY created_at DESC;

-- View unread messages only
SELECT 
    id,
    name,
    email,
    subject,
    LEFT(message, 100) as message_preview,
    created_at
FROM contact_messages
WHERE is_read = false
ORDER BY created_at DESC;

-- View read messages
SELECT 
    id,
    name,
    email,
    subject,
    LEFT(message, 100) as message_preview,
    created_at,
    read_at
FROM contact_messages
WHERE is_read = true
ORDER BY read_at DESC;

-- Get message count by read status
SELECT 
    is_read,
    COUNT(*) as count
FROM contact_messages
GROUP BY is_read;

-- Get messages from the last 7 days
SELECT 
    id,
    name,
    email,
    subject,
    LEFT(message, 100) as message_preview,
    created_at,
    is_read
FROM contact_messages
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC;

-- Get messages by email (to see if someone has contacted multiple times)
SELECT 
    email,
    COUNT(*) as message_count,
    MAX(created_at) as last_contact
FROM contact_messages
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY message_count DESC;

-- ===== COMBINED ANALYTICS =====

-- Get daily newsletter subscriptions
SELECT 
    DATE(subscribed_at) as subscription_date,
    COUNT(*) as new_subscribers
FROM newsletter_subscribers
WHERE subscribed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(subscribed_at)
ORDER BY subscription_date DESC;

-- Get daily contact form submissions
SELECT 
    DATE(created_at) as submission_date,
    COUNT(*) as new_messages
FROM contact_messages
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY submission_date DESC;

-- Get combined daily activity
SELECT 
    DATE(activity_date) as date,
    COALESCE(newsletter_subscriptions, 0) as newsletter_subscriptions,
    COALESCE(contact_messages, 0) as contact_messages
FROM (
    SELECT DATE(subscribed_at) as activity_date, COUNT(*) as newsletter_subscriptions
    FROM newsletter_subscribers
    WHERE subscribed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(subscribed_at)
) ns
FULL OUTER JOIN (
    SELECT DATE(created_at) as activity_date, COUNT(*) as contact_messages
    FROM contact_messages
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
) cm ON ns.activity_date = cm.activity_date
ORDER BY date DESC;

-- ===== ADMINISTRATIVE QUERIES =====

-- Mark a message as read (replace {message_id} with actual ID)
-- UPDATE contact_messages SET is_read = true, read_at = NOW() WHERE id = {message_id};

-- Reactivate a subscriber (replace {email} with actual email)
-- UPDATE newsletter_subscribers SET is_active = true, unsubscribed_at = NULL WHERE email = '{email}';

-- Delete old unread messages (older than 90 days)
-- DELETE FROM contact_messages WHERE is_read = false AND created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Delete old analytics data (older than 1 year)
-- DELETE FROM footer_analytics WHERE clicked_at < DATE_SUB(NOW(), INTERVAL 1 YEAR); 