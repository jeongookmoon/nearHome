// import necessary packages
const express = require("express")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const config = require("./db/configLocal")
const QUERIES = require("./db/queries")

const app = express()
const PORT = process.env.PORT || 3333
const connection = mysql.createConnection(config.configLocal)

// setup for get data from POST
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// instance of express router
const router = express.Router()

router.get("/properties/:property_id/bookings", (req, res) => {
  console.log("req.params", req.params.property_id)
})

router.get("/users/:user_id/bookings", (req, res) => {
  console.log("req.params", req.params.user_id)
})

router.post("/makeBooking", (req, res) => {
  if (req.body.property_id) {
    const values = [req.body.property_id, req.body.property_name, req.body.city, req.body.user_id]
    connection.query(QUERIES.INSERT_BOOKING, values, (error, results) => {
      if (error)
        return console.error("makeBooking error", error.message)
      console.log("makeBooking success", results)
      res.status(200).send(results)
    })
    connection.end()
  }
})

// add prefix for all api
app.use("/api", router)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
