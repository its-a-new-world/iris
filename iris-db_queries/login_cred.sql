DROP TABLE IF EXISTS users; -- Careful, this deletes the old one!

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'faculty', 'admin')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    department VARCHAR(50),
    semester VARCHAR(10), -- e.g., 'S4', 'S6' (Null for faculty)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Let's create one "Approved" Faculty and one "Approved" Student so you can log in immediately
INSERT INTO users (name, email, password_hash, role, status, department) 
VALUES ('Prof. Satish', 'satish@gectcr.ac.in', 'demo123', 'faculty', 'approved', 'Computer Science');

INSERT INTO users (name, email, password_hash, role, status, department, semester) 
VALUES ('Rahul Nair', 'rahul@example.com', 'demo123', 'student', 'approved', 'Computer Science', 'S4');