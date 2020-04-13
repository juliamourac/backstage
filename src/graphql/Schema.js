const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const commonTypeDefs = require('./common/TypeDefs');
const templateTypeDefs = require('./template/TypeDefs');
const templateResolvers = require('./template/Resolvers');
const deviceTypeDefs = require('./device/TypeDefs');
const deviceResolvers = require('./device/Resolvers');
const userTypeDefs = require('./user/TypeDefs');
const userResolvers = require('./user/Resolvers');


const query = [`
  type Query {
    #Get a template by Id
      template(id: Int!): Template
      #Checks if templates has Image Firmware and return a array with objects key-value, where key is a id template and value is a boolean.
      #The value is true if the template has image firmware.
      templatesHasImageFirmware(templatesId: [Int]!): [MapStringToString]
      getDevices(pagesize: Int, pagenumber: Int, label: String): [DeviceListPage]
      getDeviceById(deviceId: String): Device
      getDeviceHistory(input: HistoryInput): [History]
      getConfig(tenant: String!, user:String!): Config
    }
  type Mutation {
    updateConfig(tenant: String!, user:String!, config: ConfigInput!): Config!
  }
`];

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
const typeDefs = [...query, ...templateTypeDefs, ...commonTypeDefs, ...deviceTypeDefs, ...userTypeDefs];
const resolvers = merge(templateResolvers, deviceResolvers, userResolvers);

const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = executableSchema;
module.exports.typeDefs = typeDefs;
