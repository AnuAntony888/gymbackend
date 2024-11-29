const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup
exports.createEmployee = async (req, res) => {
  try {
    const {

      employeeName,
      employeeAddress,
      employeePhone,
      employeeEmail,
      master_id,
      rolles,
      created_by,
      monthsalary,
      updated_by,
      visibility = 1,
    } = req.body;

    // Validate required fields for inserting
    if (
      ! employeeName ||
      ! employeeAddress ||
      ! employeePhone ||
      ! employeeEmail ||
      ! master_id ||
     ! rolles
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const checkSql = `SELECT * FROM employeetable WHERE employeePhone  = ?`;
    db.query(checkSql, [employeePhone], (err, rows) => {
      if (err) {

        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }

      if (rows.length > 0) {
        const updateSql = `
                      UPDATE employeetable
                      SET
                                  
          employeeName =?,
          employeeAddress =?,
          employeePhone =?,
          employeeEmail =?,
          master_id =?,
          rolles =?,
                 monthsalary = ?,       
                          updated_by = ?,                
                          visibility = ?,
                          updated_timestamp = CURRENT_TIMESTAMP
                      
                      WHERE employeePhone = ?
                  `;
        const updateValues = [
        
          employeeName,
          employeeAddress,
          employeePhone,
          employeeEmail,

          master_id,
          monthsalary,
          rolles,
          updated_by,
          visibility,

          employeePhone,
        ];

        db.query(updateSql, updateValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database update failed", details: err.message });
          }

          res.status(200).json({
            message: "Employee details updated successfully",
            employee_id: rows[0].employee_id,
          });
        });
      } else {
        const insertSql = `
                      INSERT INTO employeetable (
            employee_id  ,
            employeeName ,
            employeeAddress ,
            employeePhone ,
            employeeEmail ,
            master_id ,
            rolles ,
            monthsalary ,
            created_by,
              created_timestamp,
                            visibility
              
                      )
                      VALUES (?, ?, ?, ?, ?, ?, ?,?,  ?,CURRENT_TIMESTAMP,?)
                  `;
        const insertValues = [
          uuidv4(), // Generate a new UUID for customer_id
          employeeName,
          employeeAddress,
          employeePhone,
          employeeEmail,
          master_id,
          rolles,
          monthsalary,
          created_by,
          visibility
        ];

        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database insert failed", details: err.message });
          }

          res.status(201).json({
            message: "New Empolyee Created Successfully",
            employee_id: insertValues[0],
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
