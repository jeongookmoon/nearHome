module.exports = Object.freeze({
  CREATE_DB: "CREATE DATABASE IF NOT EXISTS nearhome",
  USE_DB: "USE nearhome",
  DROP_BOOKING: "DROP TABLE IF EXISTS booking",
  CREATE_BOOKING: "CREATE TABLE IF NOT EXISTS booking "
    + "(id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, "
    + "property_id VARCHAR(255) NOT NULL, "
    + "property_name VARCHAR(255) NOT NULL, "
    + "city VARCHAR(255) NOT NULL, "
    + "user_id VARCHAR(255) NOT NULL)",
  DROP_USER: "DROP TABLE IF EXISTS user",
  CREATE_USER: "CREATE TABLE IF NOT EXISTS user "
    + "(id VARCHAR(255) NOT NULL, "
    + "name VARCHAR(255) NOT NULL)",
  INSERT_BOOKING: "INSERT INTO booking(id, property_id, property_name, city, user_id)" 
  + "VALUES(null, ?, ?, ?, ?)",
  SEARCH_BOOKINGS_BY_USER_ID: "SELECT * FROM booking AS B1 where B1.user_id = ?"
})
