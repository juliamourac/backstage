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
      let requestParameters = {};
      if (params.hasOwnProperty('page') && params.page.size != null) {
        requestParameters.page_size = params.page.size;
      }
      else {
        requestParameters.page_size = 20;
      }
      if (params.hasOwnProperty('page') && params.page.number != null) {
        requestParameters.page_num = params.page.number;
      }
      else {
        requestParameters.page_num = 1;
      }
      if (params.hasOwnProperty('filter') && params.filter.label != null) {
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

    async getDeviceHistory(root, params) {
      let history = [];
      const keys = Object.keys(params.filter);
      keys.shift();
      const requestStringPt1 = '/history/device/';
      let requestStringPt2 = '/history';

      if (keys.length != 0) {
        requestStringPt2 += '?';
        keys.forEach((element) => {
          requestStringPt2 += `${element}=${params.filter[element]}&`;
        });
      }

      let historyPromiseArray = [];
      let fetchedData = [];
      let devicePromiseArray = [];
      let devicesInfo = [];

      params.filter.devices.forEach((obj) => {
        obj.attrs.forEach(attr => {
          let requestString = `${requestStringPt1}${obj.deviceID}${requestStringPt2}&attr=${attr}`;
          const promiseHistory = axios(optionsAxios(UTIL.GET, requestString)).catch(err => {
            LOG.error(`Device id ${obj.id}: ${err}`);
            return Promise.resolve(null);
          });
          historyPromiseArray.push(promiseHistory);
        });
        const promiseDevice = axios(optionsAxios(UTIL.GET, `/device/${obj.deviceID}`));
        devicePromiseArray.push(promiseDevice);
      });

      await Promise.all(historyPromiseArray).then(values => {
        Object.keys(values).forEach(keys => {
          if(values[keys] != null){
          values[keys].data.forEach(entry => {
            fetchedData.push(entry);
          })}
        })
      }).catch(error => {
        LOG.error(`${error}`);
      });
      await Promise.all(devicePromiseArray).then(values => {
        Object.keys(values).forEach(keys => {
          devicesInfo.push(values[keys].data);
        })
      }).catch(error => {
        LOG.error(error);
      });

      devicesInfo.forEach(deviceObj => {
        //listing device attributes so a  reading's value type can be defined
        let deviceAttributes = {};
        Object.keys(deviceObj.attrs).forEach(key => {
          deviceObj.attrs[key].forEach(attr => {
            deviceAttributes[attr.label] = {
              label: attr.label,
              valueType: attr.value_type
            }
          });
        });
        
        let readings = [];
          fetchedData.forEach(data => {
            if (deviceObj.id === data.device_id) {
              readings.push({
                label: data.attr,
                valueType: formatValueType(deviceAttributes[data.attr].valueType),
                value: data.value,
                timestamp: data.ts,
              })
            }
          });

          if (readings.length != 0){
          history.push({
            deviceID: deviceObj.id,
            label: deviceObj.label,
            attrs: readings,
          });}
      });
      return history;
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
  },
};

function formatValueType(valType) {
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