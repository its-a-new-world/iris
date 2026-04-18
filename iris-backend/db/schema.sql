-- 1. Create the Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Student', 'Faculty', 'Admin')) NOT NULL,
    department VARCHAR(50),
    semester INT
);

-- 2. Create the Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    target_department VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert a test notification so we have something to see!
INSERT INTO notifications (title, content, category, sender_name, target_department)
VALUES (
    'Urgent: IEEE Hackathon Registration', 
    'The deadline for the NEXT Hackathon is approaching. Please submit your project proposals by Friday.', 
    'Urgent', 
    'Dr. Smith (HOD)', 
    'Computer Science'
);