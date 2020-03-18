const TypeDefs = [`
    enum Type{
        dynamic
        static
        actuate
    }
    enum ValueType {
        integer
        float
        text
        number
        string
        boolean
        geo
        undefined
    }
    type Meta{
        label: String!
        desc: String
        valueType: String!
        value: String!
    }
    type Attr{
        id: Int!
        label: String!
        type: Type!
        value_type: ValueType!
        value: String
        meta: [Meta!]
    }
    type Device {
        #Device id
        id: String!
        #Device label
        label: String!
        #Attributes
        attrs: [Attr!]
        #Template
        templates: [Template!]!
    }
    #Paging things
    type DeviceListPage {
        totalCount: Int!
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        devices: [Device!]
    }
    type PageInput {
        number: Int
        size: Int
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
     
     #type Config {
     #   config: Object!
     #}
      
     #input ConfigInput {
     #   config: Object!
     #}
`];

module.exports = TypeDefs;