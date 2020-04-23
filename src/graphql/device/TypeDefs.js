const TypeDefs = [`

type Device {
    id: String!
    label: String!
    attrs: [Attr]
 }
  
 enum ValueType {
    NUMBER
    STRING
    BOOLEAN
    GEO
    UNDEFINED
 }
  
 type Attr {
    label: String!
    value_type: ValueType!
 }
  
 # A paginated list of Devices.
 type DeviceListPage {
    # Identifies the total count of item.
    totalPages: Int!
    # Indicate the current Page.
    currentPage: Int!
    # List of Devices.
    devices: [Device]
 }
  
 input PageInput {
    # Identifies the page number.
    number: Int # default = 1
    # Identifies the page size.
    size: Int # default = 20
 }
  
 input FilterDeviceInput {
    # Return only devices that are named accordingly
    label: String # (prefix or suffix match)
 }
  
 input HistoryInput {
    devices: [HistoryDeviceInput]!
    beginTime: String # unix time,usar scalar DateTime?? será optional qdo tem lastN ?? 
    endTime: String # corrente caso vazio,usar scalar DateTime??
    lastN: Int # optional, default: ????
 }
  
 input HistoryDeviceInput{
    deviceID: String!
    attrs: [String]
 }
  
 type HistoryAttr {
    label: String!
    valueType: ValueType! #tipos da dojot
    value: String!
    timestamp: String! #unix time, usar scalar DateTime??
 }
  
 type History{
    deviceID: String!
    label: String!
    attrs: [HistoryAttr]
 }
  
 type Config {
    config: String!
 }
  
 input ConfigInput {
    config: String!
 }
`];

module.exports = TypeDefs;