const {connection} = require("../config/dbConnect.js");
const GetCompanies = (req, res) => {
  try {
    const query = "SELECT * FROM Companies";
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const AddCompany = (req, res) => {
  try {
    const newCompany = req.body;
    const query = "INSERT INTO Companies SET ?";
    connection.query(query, newCompany, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, ...newCompany });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DeleteCompany = (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM Companies WHERE id = ?";
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(204).send();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetCompanies,
  AddCompany,
  DeleteCompany
};
