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
        device.id = deviceData.id;
        device.label = deviceData.label;
        device.attrs = [];
        Object.keys(deviceData.attrs).forEach((key) => {
          for (let i = 0; i < deviceData.attrs[key].length; i += 1) {
            let valueType = formatValueType(deviceData.attrs[key][i].value_type);

            device.attrs.push({
              label: deviceData.attrs[key][i].label,
              type: valueType,
            });
          }
        });

        return (device);
      } catch (err) {
        LOG.error(err);
      }
    },

    async getDevices(root, params) {
      // building the request string
      let requestParameters = {
        page_size: params.page['size'] || 20,
        page_num: params.page['number'] || 1,
      }
      if (params.hasOwnProperty('filter') && params.filter.hasOwnProperty('label') ){
        requestParameters.label = params.filter.label;
      }
      let requestString = '/device?';
      const keys = Object.keys(requestParameters);
      const last = keys[keys.length - 1];
      keys.forEach((element) => {
        if (element === last) {
          requestString += `${element}=${requestParameters[element]}`;
        } else {
          requestString += `${element}=${requestParameters[element]}&`;
        }
      });

      try {
        const { data: fetchedData } = await axios(optionsAxios(UTIL.GET, requestString));
        const deviceList = ([{
          totalCount: fetchedData.devices.length,
          hasNextPage: fetchedData.pagination.has_next,
          hasPreviousPage: fetchedData.pagination.page != 1,
          devices: fetchedData.devices,
        }]);

        return deviceList;

      } catch (error) {
        LOG.error(error);
      }
    },

    getDeviceHistory(root, params){
      const history = [];
      const keys = Object.keys(params.input);
      keys.shift();
      const requestStringPt1 = '/history/device/';
      let requestStringPt2 = '/history';
      
      if (keys.length != 0) {
        requestStringPt2 += '?';
        const lastKey = keys[keys.length - 1];
        keys.forEach((element) => {
          if (element === lastKey) {
            requestStringPt2 += `${element}=${params[element]}`;
          } else {
            requestStringPt2 += `${element}=${params[element]}&`;
          }
        });
      }
      //builds request string, format history and pushes to the result to the returning array
      params.input.devices.forEach(async (obj) => {
        let requestString = `${requestStringPt1}${obj.deviceID}${requestStringPt2}`;
        try {
          const { data: fetchedData } = await axios(optionsAxios(UTIL.GET, requestString));
          const { data: deviceInfo } = await axios(optionsAxios(UTIL.GET, `/device/${obj.deviceID}`));
          let readings = [];
          
          //Reading "attribute"
          Object.keys(fetchedData).forEach(attribute => {
            //element is the object that contains a reading
            fetchedData[attribute].forEach((element) => {

              let valtype ='';
              Object.keys(deviceInfo.attrs).forEach((templateId) => {
                deviceInfo.attrs[templateId].forEach((attrData) => {
                  if (attrData.label === element.attr) {
                    valtype = formatValueType(attrData.value_type);
                  }
                });
              });

              readings.push({
                label: element.attr,
                valueType: valtype,
                value: element.value,
                timestamp: element.ts
              });
            });
            
          });

          history.push({
            deviceID: obj.deviceID,
            label: deviceInfo.label,
            attrs: readings
          });

          return history;

        } catch (error) {
          LOG.error(error);
        }
      });
    },
  },

  Device: {
    attrs(root) {
      const fetchedAttrs = root.attrs;
      const fetchedKeys = Object.keys(fetchedAttrs);

      const toReturn = [];
      fetchedKeys.forEach((element) => {
        if (fetchedAttrs[element][0].type === 'dynamic') {
          fetchedAttrs[element][0].value_type = formatValueType(fetchedAttrs[element][0].value_type);
          toReturn.push(fetchedAttrs[element][0]);
        }
      });
      return toReturn;
    },

    async templates(root) {
      const fetchedTemplates = root.templates;
      try {
        let { data: templateData } = await axios(optionsAxios(UTIL.GET, '/template'));
        templateData = templateData.templates;
        const toReturn = templateData.filter(template => fetchedTemplates.includes(template.id));
        return toReturn;
      }
      catch (error){
        LOG.error(error);
      }
    },
  },
};

function formatValueType(valType){
  let valueType = '';
  switch (valType) {
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
  return valueType;
}

module.exports = Resolvers;