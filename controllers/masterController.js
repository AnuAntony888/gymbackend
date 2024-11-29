const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper DB connection setup

exports.createmaster = async (req, res) => {
  try {
    const {
      entityName,
      entityAddress,
      entityPhone,
      created_by,
      visibility = 1,
    } = req.body;

    // Ensure required fields are present
    if (!entityName || !entityAddress || !entityPhone || !created_by) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if entityName already exists
    const checkMasterSql = `SELECT * FROM mastertabele WHERE entityName = ?`;
    const existingMaster = await new Promise((resolve, reject) => {
      db.query(checkMasterSql, [entityName], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (existingMaster.length > 0) {
      // Record exists, update the record
      const updateSql = `
        UPDATE mastertabele SET
        entityName = ?,
        entityAddress = ?,
        entityPhone = ?,
        visibility = ?,
        created_by = ?
        WHERE entityName = ?
      `;

      const updateValues = [
        entityName,
        entityAddress,
        entityPhone,
        visibility,
        created_by,
        entityName,
      ];

      await new Promise((resolve, reject) => {
        db.query(updateSql, updateValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return res.status(200).json({ message: "Record updated successfully" });
    } else {
      // Record does not exist, insert a new record
      const insertSql = `
        INSERT INTO mastertabele (
          master_id,
          entityName,
          entityAddress,
          entityPhone,       
          visibility,
          created_by
        )
        VALUES (?, ?, ?, ?, ?,?)`;

      const insertValues = [
        uuidv4(), // Generate a new UUID for master_id
        entityName,
        entityAddress,
        entityPhone,
        visibility,
        created_by,
      ];

      await new Promise((resolve, reject) => {
        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return res.status(201).json({ message: "Record created successfully" });
    }
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process record", details: err.message });
  }
};


//get customer details
exports.getAllMaster = async (req, res) => {
  const sql = "SELECT * FROM mastertabele WHERE visibility = 1";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    res.status(200).json(results);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};