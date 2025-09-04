const companyModel = {
  tableName: "companies",
  columns: {
    id: "SERIAL PRIMARY KEY",
    name: "VARCHAR(255) UNIQUE NOT NULL",
    link: "VARCHAR(500) NOT NULL",
    logo_url: "VARCHAR(500)",
    description: "TEXT",
  }
};

module.exports = companyModel;