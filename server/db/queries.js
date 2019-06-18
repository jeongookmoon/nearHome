const mysql = require("mysql")
const config = require("./configLocal")
const connection = mysql.createConnection(config.configLocal)
const DATABASE = "nearhome"

module.exports = ({
  CREATE_DB: `CREATE DATABASE IF NOT EXISTS ${DATABASE}`,
  USE_DB: `USE ${DATABASE}`,
  DROP_BOOKING: "DROP TABLE IF EXISTS booking",
  CREATE_BOOKING: "CREATE TABLE IF NOT EXISTS booking "
    + "(id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, "
    + "property_id VARCHAR(255) NOT NULL, "
    + "property_name VARCHAR(255) NOT NULL, "
    + "city VARCHAR(255) NOT NULL, "
    + "user_id VARCHAR(255) NOT NULL)",
  DROP_USER: "DROP TABLE IF EXISTS user",
  CREATE_USER: "CREATE TABLE IF NOT EXISTS user "
    + "(id VARCHAR(255) NOT NULL UNIQUE, "
    + "name VARCHAR(255) NOT NULL)",
  INSERT_BOOKING: `INSERT INTO ${DATABASE}.booking(id, property_id, property_name, city, user_id)`
    + `VALUES(null, ?, ?, ?, ?)`,
  INSERT_USER: `INSERT IGNORE INTO ${DATABASE}.user(id, name)`
    + `VALUES(?, ?)`,
  SEARCH_BOOKINGS_BY_USER_ID: `SELECT * FROM ${DATABASE}.booking AS B1 where B1.user_id = ? `,
  SEARCH_BOOKINGS_BY_PROPERTY_ID: `SELECT B1.id AS id, B1.property_id AS property_id, `
    + `B1.property_name AS property_name, B1.city AS city, `
    + `JSON_OBJECT('id', B1.user_id, 'name', U1.name) AS user `
    + `FROM ${DATABASE}.booking AS B1 INNER JOIN ${DATABASE}.user as U1 `
    + `on B1.user_id = U1.id where B1.property_id = ?`,
  SEARCH_USER_BY_USER_ID: `SELECT * FROM ${DATABASE}.user AS U1 where U1.id = ?`,
  run: (query) => {
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error)
          reject(error)
        else {
          resolve(results)
        }
      })
    })
  }
})
