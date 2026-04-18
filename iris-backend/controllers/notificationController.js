const db = require('../db'); // Your database connection file

const getNotifications = async (req, res) => {
    try {
        // Fetch all notifications, newest first
        const result = await db.query('SELECT * FROM notifications ORDER BY created_at DESC');
        
        // Send the rows back to the frontend
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching notifications" });
    }
};

module.exports = {
    getNotifications
};