require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer'); // Added for file handling
const bcrypt = require('bcryptjs');
const db = require('./db');
const app = express();

// Configure where to store uploaded files temporarily
const upload = multer({ dest: 'uploads/' });

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error) => {
    if (error) console.log("❌ Nodemailer Error:", error);
    else console.log("✅ Server is ready to take our messages");
});

// Middleware
app.use(express.json());
app.use(cors());

// --- ROUTES ---

// 1. Fetch Deadlines
app.get('/api/deadlines', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT *, (deadline_date - CURRENT_DATE) as days_left FROM deadlines ORDER BY deadline_date ASC'
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Mark Notification as Read
app.put('/api/notifications/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 3. Faculty Broadcast (Supports File Uploads)
// 'attachment' must match the key used in the Frontend FormData
app.post('/api/faculty/broadcast', upload.single('attachment'), async (req, res) => {
    const { title, content, category, studentEmails, senderName } = req.body;
    const file = req.file; // The uploaded file object

    try {
        // Save to Database
        await db.query(
            'INSERT INTO notifications (title, content, category, sender_name, target_department) VALUES ($1, $2, $3, $4, $5)',
            [title, content, category, senderName || 'Faculty', 'GEC Thrissur']
        );

        // Prepare Email
        const mailOptions = {
            from: `"${senderName} via IRIS" <${process.env.EMAIL_USER}>`,
            to: studentEmails.split(',').map(e => e.trim()),
            subject: `[IRIS ALERT] ${title}`,
            text: `Official notice from ${senderName}:\n\n${content}\n\nCheck your IRIS dashboard for details.`,
            attachments: file ? [{
                filename: file.originalname,
                path: file.path // Nodemailer picks it up from the /uploads folder
            }] : []
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Broadcast Error:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --- REGISTER ROUTE ---
app.post('/api/auth/register', async (req, res) => {
    const { name, email, phone, password, role, department, semester } = req.body;
    
    try {
        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert as 'pending'
        await db.query(
            'INSERT INTO users (name, email, phone, password_hash, role, department, semester, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, email, phone, hashedPassword, role, department, role === 'student' ? semester : null, 'pending']
        );
        res.status(201).json({ success: true, message: "Registration pending admin approval" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Email might already exist." });
    }
});

// --- LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const user = userResult.rows[0];

        // 2. Check Password
        // (If you used the raw SQL INSERT earlier with 'demo123', bcrypt.compare will fail. 
        // For the demo, we will check both raw text OR hashed just in case)
        const isMatch = await bcrypt.compare(password, user.password_hash) || password === user.password_hash;
        
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        // 3. Return user data (DO NOT send the password back!)
        res.status(200).json({ 
            success: true, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                department: user.department,
                semester: user.semester
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
app.post('/api/faculty/broadcast', upload.single('attachment'), async (req, res) => {
    const { title, content, category, senderName, targetRole, targetDept, targetSem } = req.body;
    const file = req.file;

    try {
        // 1. DYNAMIC FILTHRING: Find students who match the criteria
        // Example: Only S4 Computer Science students
        let studentQuery = "SELECT email FROM users WHERE role = 'student'";
        let params = [];

        if (targetDept !== 'All') {
            studentQuery += " AND department = $" + (params.length + 1);
            params.push(targetDept);
        }
        if (targetSem !== 'All') {
            studentQuery += " AND semester = $" + (params.length + 1);
            params.push(targetSem);
        }

        const result = await db.query(studentQuery, params);
        const emails = result.rows.map(r => r.email);

        // 2. Insert into notifications table so it shows on Dashboards
        await db.query(
            'INSERT INTO notifications (title, content, category, sender_name, target_department) VALUES ($1, $2, $3, $4, $5)',
            [title, content, category, senderName, targetDept]
        );

        // 3. Send the Emails
        if (emails.length > 0) {
            await transporter.sendMail({
                from: `"${senderName} via IRIS" <${process.env.EMAIL_USER}>`,
                to: emails,
                subject: `[IRIS] ${title}`,
                text: content,
                attachments: file ? [{ filename: file.originalname, path: file.path }] : []
            });
        }

        res.status(200).json({ success: true, recipients: emails.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Broadcast failed" });
    }
});
// Get all pending users
app.get('/api/admin/pending', async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, email, role, department, semester FROM users WHERE status = 'pending'");
        res.json(result.rows);
    } catch (err) { res.status(500).send(err.message); }
});

// Update user status (Approve/Reject)
app.put('/api/admin/verify/:id', async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    try {
        await db.query("UPDATE users SET status = $1 WHERE id = $2", [status, req.params.id]);
        res.send(`User ${status}`);
    } catch (err) { res.status(500).send(err.message); }
});