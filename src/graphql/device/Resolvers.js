const axios = require('axios');
const UTIL = require('../utils/AxiosUtils');
const LOG = require('../../utils/Log');

const optionsAxios = ((method, url) => UTIL.optionsAxios(method, url, ''));

const Resolvers = {
  Query: {
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
        console.log(fetchedData);
        const deviceList = ([{
          totalCount: fetchedData.devices.length,
          hasNextPage: fetchedData.pagination.has_next,
          hasPreviousPage: fetchedData.pagination.page != 1,
          devices: fetchedData.devices,
        }]);
        return deviceList;
      } catch (error) {
        LOG.console.warn(error);
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
      console.log(`Template: ${toReturn}`);
      return toReturn;
    },
  },
};

module.exports = Resolvers;