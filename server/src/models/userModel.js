const userModel = {
  tableName: "users",
  columns: {
    id: "SERIAL PRIMARY KEY",
    name: "VARCHAR(100) NOT NULL",
    email: "VARCHAR(255) UNIQUE NOT NULL",
    student_email: "VARCHAR(255) UNIQUE NOT NULL",
    password: "TEXT NOT NULL",
    role: "VARCHAR(50) DEFAULT 'student'",
    created_at: "TIMESTAMP DEFAULT NOW()",
    updated_at: "TIMESTAMP DEFAULT NOW()"
  }
};

module.exports = userModel;