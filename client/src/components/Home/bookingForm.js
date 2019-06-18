import React from "react"
import axios from "axios"
import { Form, Input, Icon, Radio, Button, notification } from "antd"
import { USER_NAME_MISMATCH, BOOKING_SUCCESS } from "../../consts/apiRule"

class BookingForm extends React.Component {
  constructor(props) {
    super()
    this.state = {
      name: null,
      id: null,
      chosenHotel: null
    }
  }

  openNotification = (params, result) => {
    const { city, user_id, property_name, property_id } = params
    const { name } = this.state
    let args = null
    if (result === BOOKING_SUCCESS) {
      args = {
        message: "Booking Success",
        description: <div>
          <div>User Name: <strong>{name}</strong></div>
          <div>User ID: <span style={{ color: '#108ee9' }}>{user_id}</span>
          </div>
          <div>Property Name: <strong>{property_name}</strong></div>
          <div>City: <strong>{city}</strong></div>
          <div>Property ID: <span style={{ color: '#108ee9' }}>{property_id}</span>
          </div>
        </div>,
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        duration: 5
      }
    } else {
      args = {
        message: "Booking Failed",
        description:
          <div>
            Name ( <strong>{name}</strong> ) mismatches with
            ( #id: <span style={{ color: '#FF851B', fontWeight: "bold" }}>{user_id}</span> )
          </div>
        ,
        icon: <Icon type="meh" style={{ color: '#FF851B' }} />,
        duration: 5
      }
    }

    notification.open(args)
  }

  makeBooking = async event => {
    event.preventDefault()
    const { chosenHotel, id, name } = this.state
    let city = ""
    // find name of city based on pattern that it's between ">" and ","
    // but this could be wrong for some cases
    // should find a better solution
    if (chosenHotel.vicinity && typeof chosenHotel.vicinity === "string") {
      city = chosenHotel.vicinity.split(">")[1].split(",")[0]
    }

    const params = {
      property_id: chosenHotel.id,
      property_name: chosenHotel.title,
      city,
      user_id: id,
      user_name: name
    }
    const checkuser = await axios.post("api/checkAndAddUserAndAddBooking", params)
    console.log('checkuser', checkuser.data)
    if (checkuser.data === BOOKING_SUCCESS)
      this.openNotification(params, BOOKING_SUCCESS)
    else if (checkuser.data === USER_NAME_MISMATCH) {
      this.openNotification(params, USER_NAME_MISMATCH)
    }
  }

  handleChange = event => {
    event.preventDefault()
    const { name, value } = event.target
    const { hotelData } = this.props

    if (name === "hotel") {
      const index = parseInt(value)
      this.setState(prevState => ({
        ...prevState,
        chosenHotel: hotelData[index]
      }))
    } else {
      this.setState(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  render() {
    const { hotelData, latitude, longitude } = this.props
    const { name, id } = this.state
    return (
      <div style={{ margin: "auto", width: "50%" }}>
        <div>Current Latitude: <span style={{ color: '#3D9970' }}>{latitude} </span>
          and Longitude: <span style={{ color: '#3D9970' }}>{longitude}</span></div>
        <div>
          <Form layout="inline" onSubmit={this.makeBooking}>
            <Form.Item>
              <Input prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="text" placeholder="Name" name="name" value={name} onChange={this.handleChange} required />
            </Form.Item>
            <Form.Item>
              <Input prefix={<Icon type="info-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="text" placeholder="User ID" name="id" value={id} onChange={this.handleChange} required />
            </Form.Item>
            <div><strong>Nearby Hotels: </strong></div>
            <Radio.Group onChange={this.handleChange} name="hotel">
              {(hotelData.length > 0) ?
                hotelData.map((hotel, index) =>
                  <Radio.Button value={index} key={"hotel" + index}
                    style={{ marginTop: "1vh" }} htmlType="hotel">{hotel.title}</Radio.Button>)
                : <div>No Hotels Nearby</div>}
            </Radio.Group>
            <Button type="primary" htmlType="submit" style={{ marginTop: "1vh", marginBottom: "1vh" }}>Book</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default BookingForm
