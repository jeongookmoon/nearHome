// import necessary packages
const express = require("express")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const config = require("./db/configLocal")
const QUERIES = require("./db/queries")
const API_RULE = require("./consts/apiRule")

const app = express()
const PORT = process.env.PORT || 3333
const connection = mysql.createConnection(config.configLocal)

// setup for get data from POST
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// instance of express router
const router = express.Router()

router.get("/properties/:property_id/bookings", (req, res) => {
  if (req.params.property_id) {
    const propertyID = [req.params.property_id]
    const findBookingsByPropIdQuery = mysql.format(QUERIES.SEARCH_BOOKINGS_BY_PROPERTY_ID, propertyID)
    QUERIES.run(findBookingsByPropIdQuery)
      .then(findBookingsByPropIdResult => {
        let result = []
        if(findBookingsByPropIdResult && findBookingsByPropIdResult.length > 0) {
          result = findBookingsByPropIdResult.map(element => {
            const toObj = JSON.parse(element.user)
            let copyElement = {...element}
            copyElement.user = toObj
            return copyElement
          })
          console.log('result', result)
        }
        res.status(200).send(result)
      }).catch(findBookingsByPropIdError => console.log(">> findBookingsByPropIdError ", findBookingsByPropIdError))
  } else {
    console.log(">> Find Booking by PropID Failed: Request Body Error")
    res.status(200).send(API_RULE.REQUEST_BODY_ERROR)
  }
})

router.get("/users/:user_id/bookings", (req, res) => {
  if (req.params.user_id) {
    const userID = [req.params.user_id]
    const findBookingsByUserIdQuery = mysql.format(QUERIES.SEARCH_BOOKINGS_BY_USER_ID, userID)
    QUERIES.run(findBookingsByUserIdQuery).then(findBookingsByUserIdResult => {
      console.log(">> findBookingsByUserIdResult ", findBookingsByUserIdResult)
      res.status(200).send(findBookingsByUserIdResult)
    }).catch(findBookingsByUserIdError => console.log(">> findBookingsByUserIdError ", findBookingsByUserIdError))
  } else {
    console.log(">> Find Booking by UserID Failed: Request Body Error")
    res.status(200).send(API_RULE.REQUEST_BODY_ERROR)
  }
})

router.post("/checkAndAddUserAndAddBooking", (req, res) => {
  const { property_id, property_name, city, user_id, user_name } = req.body
  const userValues = [user_id, user_name]
  const userID = [user_id]
  const bookingValues = [property_id, property_name, city, user_id]

  const checkUserExistsQuery = mysql.format(QUERIES.SEARCH_USER_BY_USER_ID, userID)
  const addUserQuery = mysql.format(QUERIES.INSERT_USER, userValues)
  const addBookingQuery = mysql.format(QUERIES.INSERT_BOOKING, bookingValues)

  if (user_id && user_name) {
    QUERIES.run(checkUserExistsQuery).then(checkUserExistsResult => {
      // console.log("checkUserExistsResult", checkUserExistsResult)
      if (Array.isArray(checkUserExistsResult)) {
        // new user
        if (checkUserExistsResult.length === 0) {
          // add user
          QUERIES.run(addUserQuery).then(addUserResult => {
            console.log(">> addUserResult ", addUserResult)
            // add booking
            QUERIES.run(addBookingQuery).then(addBookingNewUserResult => {
              console.log(">> addBookingNewUserResult ", addBookingNewUserResult)
              res.status(200).send(API_RULE.BOOKING_SUCCESS)
            }).catch(addBookingError => console.log(">> addBookingError ", addBookingError))
          }).catch(addUserError => console.log(">> addUserError ", addUserError))
        } else {
          const resultUserName = checkUserExistsResult[0].name
          if (resultUserName === user_name) {
            // existing user
            // add booking
            QUERIES.run(addBookingQuery).then(addBookingExistingUserResult => {
              console.log(">> addBookingExistingUserResult ", addBookingExistingUserResult)
              res.status(200).send(API_RULE.BOOKING_SUCCESS)
            }).catch(addBookingExistingUserError => console.log(">> addBookingExistingUserError ", addBookingExistingUserError))
          } else {
            // user id found but name doesn't match
            console.log(">> Booking Failed: Name Mismatch")
            res.status(200).send(API_RULE.USER_NAME_MISMATCH)
          }
        }
      }
    }).catch(checkUserExistsError => console.log(">> checkUserExistsError ", checkUserExistsError))
  } else {
    console.log(">> Booking Failed: Request Body Error")
    res.status(200).send(API_RULE.REQUEST_BODY_ERROR)
  }
})

// add prefix for all api
app.use("/api", router)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
