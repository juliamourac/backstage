const axios = require('axios');
const UTIL = require('../utils/AxiosUtils');
const LOG = require('../../utils/Log');

const params = {
  token: null,
};
const setToken = ((token) => {
  params.token = token;
});
const optionsAxios = ((method, url) => UTIL.optionsAxios(method, url, params.token));

const Resolvers = {
  Query: {

    async getDeviceById(root, { deviceId }, context) {
      setToken(context.token);

      const device = {};

      try {
        const { data: deviceData } = await axios(optionsAxios(UTIL.GET, `/device/${deviceId}`));
        // console.log('data', deviceData);
        device.id = deviceData.id;
        device.label = deviceData.label;
        device.attrs = [];
        Object.keys(deviceData.attrs).forEach((key) => {
          for (let i = 0; i < deviceData.attrs[key].length; i += 1) {
            let valueType = '';

            switch (deviceData.attrs[key][i].value_type) {
              case 'integer':
                valueType = 'NUMBER';
                break;
              case 'float':
                valueType = 'NUMBER';
                break;
              case 'bool':
                valueType = 'BOOLEAN';
                break;
              case 'string':
                valueType = 'STRING';
                break;
              case 'geo:point':
                valueType = 'GEO';
                break;
              default:
                valueType = 'UNDEFINED';
            }

            device.attrs.push({
              label: deviceData.attrs[key][i].label,
              type: valueType,
            });
          }
        });

        return (device);
      } catch (err) {
        console.log('erro', err);
        return (err);
      }
    },

    async getDevices(root, params) {
      // building the request string
      // TODO: is there a better way to do this?
      let requestString = '/device?';
      const keys = Object.keys(params);
      const last = keys[keys.length - 1];
      keys.forEach((element) => {
        if (element === last) {
          requestString += `${element}=${params[element]}`;
        } else {
          requestString += `${element}=${params[element]}&`;
        }
      });

      try {
        const { data: fetchedData } = await axios(optionsAxios(UTIL.GET, requestString));
        // console.log(fetchedData);
        const deviceList = ([{
          totalCount: fetchedData.devices.length,
          hasNextPage: fetchedData.pagination.has_next,
          hasPreviousPage: fetchedData.pagination.page != 1,
          devices: fetchedData.devices,
        }]);

        console.log(deviceList);

        return deviceList;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Device: {
    attrs(root) {
      const fetchedAttrs = root.attrs;
      const fetchedKeys = Object.keys(fetchedAttrs);

      const toReturn = [];
      fetchedKeys.forEach((element) => {
        if (fetchedAttrs[element][0].type === 'dynamic') {
          toReturn.push(fetchedAttrs[element][0]);
        }
      });
      // console.log(`Final: ${JSON.stringify(toReturn)}`);
      return toReturn;
    },

    async templates(root) {
      const fetchedTemplates = root.templates;
      let { data: templateData } = await axios(optionsAxios(UTIL.GET, '/template'));
      templateData = templateData.templates;
      const fetchedKeys = Object.keys(fetchedTemplates);
      const toReturn = templateData.filter(template => fetchedTemplates.includes(template.id));
      // console.log(`Template: ${toReturn}`);
      return toReturn;
    },
  },
};

module.exports = Resolvers;