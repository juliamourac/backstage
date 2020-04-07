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

    getDeviceHistory(root, params){
      const history = [];
      const keys = Object.keys(params.input);
      keys.shift();
      console.log(`Keys: ${keys}`); 
      const requestStringPt1 = '/history/device/';
      let requestStringPt2 = '/history'
      
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
          
          //Atributo da leitura
          Object.keys(fetchedData).forEach(attribute => {
            //element is the object that contains a reading
            fetchedData[attribute].forEach((element) => {

              let valtype ='';
              Object.keys(deviceInfo.attrs).forEach((templateId) => {
                deviceInfo.attrs[templateId].forEach((attrData) => {
                  if (attrData.label === element.attr) {
                    valtype = attrData.value_type;
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

          console.log(`History: ${JSON.stringify(history)}`);
          return history;

        } catch (error) {
          LOG.warn(error);
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