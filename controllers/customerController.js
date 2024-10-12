const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

exports.createCustomer = async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      customerName,
      customerContactNo,
      customerEmail,
      customerAddress,
      customerOption,
      created_by,
      updated_by,
      user_id,
      visibility = 1,
    } = req.body;

    // Validate required fields for inserting
    if (
      !customerName ||
      !customerContactNo ||
      !customerEmail ||
      !customerAddress ||
      !customerOption
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const checkSql = `SELECT * FROM customertabele WHERE customerContactNo = ?`;
    db.query(checkSql, [customerContactNo], (err, rows) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }

      if (rows.length > 0) {
        const updateSql = `
                    UPDATE customertabele
                    SET
                        customerName = ?,
                        customerAddress = ?,
                        customerEmail = ?,
                        customerOption = ?,
                        updated_by = ?,                
                        visibility = ?,
                        updated_timestamp = CURRENT_TIMESTAMP,
                        user_id = ?
                    WHERE customerContactNo = ?
                `;
        const updateValues = [
          customerName,
          customerAddress,
          customerEmail,
          customerOption,
          updated_by,
          visibility,
          user_id,
          customerContactNo,
        ];

        db.query(updateSql, updateValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database update failed", details: err.message });
          }

          res.status(200).json({
            message: "Customer details updated successfully",
            customer_id: rows[0].customer_id,
          });
        });
      } else {
        const insertSql = `
                    INSERT INTO customertabele (
                        customer_id,
                        customerName,
                        customerContactNo,
                        customerEmail,
                        customerAddress,
                        customerOption,
                        created_by,
                        created_timestamp,
                        visibility,
                        user_id
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?,?)
                `;
        const insertValues = [
          uuidv4(), // Generate a new UUID for customer_id
          customerName,
          customerContactNo,
          customerEmail,
          customerAddress,
          customerOption,
          created_by,
          visibility,
          user_id,
        ];

        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database insert failed", details: err.message });
          }

          res.status(201).json({
            message: "New Customer Created Successfully",
            customer_id: insertValues[0],
          });
        });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process item", details: err.message });
  }
};
