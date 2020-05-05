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
    totalPages: Int!
    currentPage: Int!
    devices: [Device]
 }
  
 # number: Identifies the page number.
 # size: Identifies the page size.
 input PageInput {
    number: Int
    size: Int
 }
  
 # Return only devices that are named accordingly (prefix or suffix match)
 input FilterDeviceInput {
    label: String
 }
  
 input HistoryInput {
    devices: [HistoryDeviceInput]!
    beginTime: String
    endTime: String
    lastN: Int
 }
  
 input HistoryDeviceInput{
    deviceID: String!
    attrs: [String]
 }
  
 type HistoryAttr {
    label: String!
    valueType: ValueType!
    value: String!
    timestamp: String!
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