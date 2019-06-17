const mysql = require("mysql")
const config = require("./configLocal")
const connection = mysql.createConnection(config.configInitLocal)
const QUERIES = require("./queries")


connection.connect((error) => {
  if (error)
    return console.error("error: " + error.message)
  console.log("DB connected!")

  // create db
  connection.query(QUERIES.CREATE_DB, (error, result) => {
    if (error)
      return console.error("error: " + error.message)
    console.log("Local database created")
  })

  // select db
  connection.query(QUERIES.USE_DB, (error, result) => {
    if (error)
      return console.error("error: " + error.message)
    console.log("Nearhome DB selected")
  })

  // drop booking table if exists
  connection.query(QUERIES.DROP_BOOKING, (error, result) => {
    if (error)
      return console.error("error: " + error.message)
    console.log("Booking table dropped")
  })

  // create booking table
  connection.query(QUERIES.CREATE_BOOKING, (error, result) => {
    if (error)
      return console.error("error: " + error.message)
    console.log("Booking table created")
  })

  // drop user table if exists
  connection.query(QUERIES.DROP_USER, (error, result) => {
    if (error)
      return console.error("error: " + error.message)
    console.log("User table dropped")
  })

  // create user table
  connection.query(QUERIES.CREATE_USER, (error, result) => {
    if (error)
      return console.error("error: " + error.message)
    console.log("User table created")
  })

  // end connection
  connection.end((error) => {
    if (error)
      return console.error("error: " + error.message)
  })
  // const createBooking = `create table `
})

