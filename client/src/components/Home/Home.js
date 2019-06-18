import React from "react"
import axios from "axios"
import BookingForm from "./bookingForm"
import SearchBooking from "./searchBooking"

class Home extends React.Component {
  state = {
    currentPosition: {
      latitude: null,
      longitude: null
    },
    nearByHotels: null,
    errors: []
  }

  componentDidMount() {
    this.getNearbyHotelData()
  }

  backendTest = async () => {
    try {
      await axios.get("api/hello")
    } catch (error) {
      this.updateError("Fetch Error: Hello Api")
    }
  }

  getNearbyHotelData() {
    // retrieve user's current position
    if (window.navigator.geolocation) {
      const timelimit = { timeout: 10000 }
      window.navigator.geolocation
        .getCurrentPosition(this.fetchNearbyHotels, this.positionErrorHandler, timelimit)
    }
    else
      this.updateError("Browser: Geolocation Not Supported")
  }

  updateError = (message) => {
    this.setState(prevState => ({
      errors: [...prevState.errors, message]
    }))
  }

  positionErrorHandler = (error) => {
    if (error.code === 1)
      this.updateError("User Location: Acess Denied")
    else if (error.code === 2)
      this.updateError("User Location: Not Available")
  }

  fetchNearbyHotels = (position) => {
    const { latitude, longitude } = position.coords
    this.setState({
      currentPosition: {
        latitude,
        longitude
      }
    }, () => {
      const apiCall = `https://places.cit.api.here.com/places/v1/autosuggest`
        + `?at=${latitude},${longitude}&q=hotel`
        + `&app_id=${process.env.REACT_APP_HERE_APP_ID}`
        + `&app_code=${process.env.REACT_APP_HERE_APP_CODE}`

      axios.get(apiCall).then(result => {
        // filter out auxiliary data
        const filteredData = result.data.results.filter(eachData => eachData.hasOwnProperty("id") && eachData.category === "hotel")
        this.setState({
          ...this.state,
          nearByHotels: filteredData
        })
      }).catch(error => this.updateError("Fetch Error: Nearby Hotels"))
    })
  }

  render() {
    const { latitude, longitude } = this.state.currentPosition
    const { nearByHotels, errors } = this.state
    if (latitude && nearByHotels && errors.length === 0) {
      return (
        <div>
          <BookingForm latitude={latitude} longitude={longitude} hotelData={nearByHotels} />
          <SearchBooking />
        </div>
      )
    } else {
      return (
        <div>
          {(errors.length > 0) ?
            errors.map((error, index) => <div key={"error" + index}>{error}</div>) : <div>Loading...</div>}
        </div>
      )
    }
  }
}

export default Home
