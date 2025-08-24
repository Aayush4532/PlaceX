const companyModel = {
  tableName: "companies",
  columns: {
    id: "SERIAL PRIMARY KEY",
    name: "VARCHAR(255) UNIQUE NOT NULL",
    website: "VARCHAR(500) NOT NULL",
    logo_url: "VARCHAR(500)",
    description: "TEXT",
    career_deadline: "TIMESTAMP",
    created_at: "TIMESTAMP DEFAULT NOW()"
  }
};

module.exports = companyModel;