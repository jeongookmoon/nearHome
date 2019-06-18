import React from "react"
import { Table, Input, Select } from "antd"
import Axios from "axios";

const BY_USER_ID = "By UserID"
const BY_PROP_ID = "By PropID"

class searchBooking extends React.Component {
  state = {
    bookingData: null,
    tableHeaders: null,
    tableData: null,
    type: BY_USER_ID,
  }

  selectOption = type => {
    this.setState({ ...this.state, type })
  }

  search = input => {
    this.fetchData(input)
  }

  fetchData = async (id) => {
    const { type } = this.state
    let bookingData = null
    let tableHeaders = null
    let tableData = null

    if (type === BY_USER_ID) {
      const bookingSearchByUserQuery = `api/users/${id}/bookings`
      bookingData = (await Axios.get(bookingSearchByUserQuery)).data
    } else {
      const bookingSearchByPropQuery = `api/properties/${id}/bookings`
      bookingData = (await Axios.get(bookingSearchByPropQuery)).data
    }

    if (bookingData && bookingData.length > 0) {
      const flattenColumnHeaders = this.flattenObjectForHeader(bookingData[0])
      tableHeaders = this.makeColumnHeadersForTable(flattenColumnHeaders)
      tableData = this.flattenObjectForData(bookingData)
    }
    console.log('bookingData', bookingData)
    this.setState({ ...this.state, bookingData, tableHeaders, tableData}, () => console.log('this.state', this.state))
  }

  flattenObjectForHeader = (data) => {
    const { type } = this.state
    const result = []
    if (type === BY_PROP_ID) {
      for (let key in data) {
        const element = data[key]
        if (typeof element === "object") {
          for (let prop in element) {
            const newProp = `${key}_${prop}`
            result.push(newProp)
          }
        } else
          result.push(key)
      }
      return result
    }
    return Object.keys(data)
  }

  flattenObjectForData = (data) => {
    const { type } = this.state
    if (type === BY_USER_ID)
      return data
    const result = []
    data.forEach(item => {
      let newItem = {}
      for (let key in item) {
        const element = item[key]
        if (typeof element === "object") {
          for (let prop in element) {
            const newProp = `${key}_${prop}`
            newItem[newProp] = element[prop]
          }
        } else
          newItem[key] = element
      }
      result.push(newItem)
    })
    return result
  }

  makeColumnHeadersForTable(columns) {
    let result = []

    columns.forEach(key => {
      const columnDetail = {}
      columnDetail.title = key
      columnDetail.dataIndex = key
      columnDetail.key = key
      result.push(columnDetail)
    })
    return result
  }

  render() {
    const Search = Input.Search
    const InputGroup = Input.Group
    const { Option } = Select
    const { type, columnHeadersForTable, bookingDataForTable } = this.state

    return (
      <div style={{ margin: "auto", width: "50%" }}>
        <InputGroup compact>
          <Select defaultValue={type} onChange={this.selectOption}>
            <Option value={BY_USER_ID}>{BY_USER_ID}</Option>
            <Option value={BY_PROP_ID}>{BY_PROP_ID}</Option>
          </Select>
          <Search
            placeholder={"Booking Search " + type}
            onSearch={this.search}
            style={{ width: 500 }}
            enterButton
          />
        </InputGroup>
        {(columnHeadersForTable && bookingDataForTable) ?
          <Table columns={columnHeadersForTable} dataSource={bookingDataForTable} key={Math.random} />
          : <div />}
      </div>
    )
  }
}

export default searchBooking
