const axios = require('axios');
const Resolvers = require('../../../graphql/device/Resolvers');
const { device1, deviceReading } = require('../../apiMock/device');

jest.mock('axios');

afterEach(() => {
  axios.mockReset();
});

it('should get a device', async () => {
  const root = {};
  const params = { deviceId: '10cf' };
  const context = {};

  axios.mockImplementationOnce(() => Promise.resolve({
    data: {
      attrs: {
        4865: [
          {
            created: '2017-12-20T18:14:43.994796+00:00',
            id: 30,
            label: 'dynamicattr',
            template_id: '4865',
            type: 'dynamic',
            value_type: 'float',
          },
          {
            created: '2017-12-20T18:14:44.015474+00:00',
            id: 32,
            label: 'static',
            template_id: '4865',
            static_value: '20',
            type: 'static',
            value_type: 'float',
          },
          {
            created: '2017-12-20T18:14:44.016804+00:00',
            id: 33,
            label: 'actuate',
            is_static_overridden: false,
            template_id: '4865',
            type: 'actuator',
            value_type: 'bool',
          },
        ],
      },
      created: '2017-12-20T18:15:08.864677+00:00',
      id: '10cf',
      label: 'sensor-4',
      templates: [
        '4865',
      ],
    },
  }));

  const output = await Resolvers.Query.getDeviceById(root, params, context);

  expect(output).toEqual({
    id: '10cf',
    label: 'sensor-4',
    attrs: [{
      label: 'dynamicattr',
      value_type: 'NUMBER',
    }],
  });
});


it('should get a list of devices', () => {
  axios.mockResolvedValue({
    data: {
      devices: [
        {
          id: '124e15',
          label: 'disp12',
          attrs: [
            {
              label: 'attr1',
              type: 'dynamic',
              value_type: 'NUMBER',
              value: null,
              meta: null,
            },
          ],
          templates: [
            {
              label: 'Template',
              id: 1,
            },
          ],
        },
        {
          id: '17e0d0',
          label: 'disp11',
          attrs: {
            1: [
              {
                label: 'attr1',
                type: 'dynamic',
                value_type: 'NUMBER',
                value: null,
                meta: null,
              },
            ],
          },
          templates: [
            {
              label: 'Template',
              id: 1,
            },
          ],
        },
        {
          id: '65f9d7',
          label: 'disp10',
          attrs: {
            1: [
              {
                label: 'attr1',
                type: 'dynamic',
                value_type: 'NUMBER',
                value: null,
                meta: null,
              },
            ],
          },
          templates: [
            {
              label: 'Template',
              id: 1,
            },
          ],
        },
      ],
      pagination: {
        has_next: false,
        next_page: null,
        page: 1,
        total: 1,
      },
    },
  });
  const root = {};
  const params = { page: { number: 1, size: 4 }, filter: { label: 'd' } };

  return Resolvers.Query.getDevices(root, params).then((output) => {
    expect(output).toEqual([
      {
        totalPages: 1,
        currentPage: 1,
        devices: [
          {
            attrs: [
              {
                label: 'attr1',
                meta: null,
                type: 'dynamic',
                value: null,
                value_type: 'NUMBER',
              },
            ],
            id: '124e15',
            label: 'disp12',
            templates: [
              {
                id: 1,
                label: 'Template',
              },
            ],
          },
          {
            attrs: {
              1: [
                {
                  label: 'attr1',
                  meta: null,
                  type: 'dynamic',
                  value: null,
                  value_type: 'NUMBER',
                },
              ],
            },
            id: '17e0d0',
            label: 'disp11',
            templates: [
              {
                id: 1,
                label: 'Template',
              },
            ],
          },
          {
            attrs: {
              1: [
                {
                  label: 'attr1',
                  meta: null,
                  type: 'dynamic',
                  value: null,
                  value_type: 'NUMBER',
                },
              ],
            },
            id: '65f9d7',
            label: 'disp10',
            templates: [
              {
                id: 1,
                label: 'Template',
              },
            ],
          },
        ],
      },
    ]);
  });
});

it('should return a list of history entries', async () => {
  jest.mock('axios');

  const root = {};
  const params = {
    filter: {
      devices: [{ deviceID: '0998', attrs: ['temperature'] }],
      lastN: 3,
    },
  };

  const devReading = {
    data: [{
      device_id: '0998',
      ts: '2018-03-22T13:47:07.050000Z',
      value: 10.6,
      attr: 'temperature',
    },
    {
      device_id: '0998',
      ts: '2018-03-22T13:46:42.455000Z',
      value: 15.6,
      attr: 'temperature',
    },
    {
      device_id: '0998',
      ts: '2018-03-22T13:46:21.535000Z',
      value: 36.5,
      attr: 'temperature',
    }],
  };
  const dev = {
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'string',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'float',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  };

  axios.mockResolvedValue('default value')
    .mockResolvedValueOnce(devReading)
    .mockResolvedValueOnce(dev);

  const expectedResult = [{
    deviceID: '0998',
    label: 'Thermometer',
    attrs: [{
      label: 'temperature',
      valueType: 'NUMBER',
      value: 10.6,
      timestamp: '2018-03-22T13:47:07.050000Z',
    },
    {
      label: 'temperature',
      valueType: 'NUMBER',
      value: 15.6,
      timestamp: '2018-03-22T13:46:42.455000Z',
    },
    {
      label: 'temperature',
      valueType: 'NUMBER',
      value: 36.5,
      timestamp: '2018-03-22T13:46:21.535000Z',
    }],
  }];

  const result = await Resolvers.Query.getDeviceHistory(root, params);
  expect(result).toEqual(expectedResult);
});

it('should return empty array', async () => {
  jest.mock('axios');

  const root = {};
  const params = {
    filter: {
      devices: [{ deviceID: '0998', attrs: ['temperature'] }],
      lastN: 3,
    },
  };

  axios.mockResolvedValue('default value')
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce(deviceReading);

  const result = await Resolvers.Query.getDeviceHistory(root, params);
  expect(result).toEqual([]);
});

it('should return history from 2 devices', async () => {
  jest.mock('axios');

  const devices = [{
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'string',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'float',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  }, {
    data: {
      attrs: {
        1: [
          {
            created: '2020-05-06T16:19:32.247307+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'hue',
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'string',
          },
          {
            created: '2020-05-06T16:19:32.397514+00:00',
            id: 2,
            is_static_overridden: false,
            label: 'intensity',
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'integer',
          },
        ],
      },
      created: '2020-05-06T16:19:46.185424+00:00',
      id: '8aa0f9',
      label: 'Living_Room',
      templates: [
        1,
      ],
    },
  }];

  const historyData = {
    0: {
      data: [{
        device_id: '0998',
        ts: '2018-03-22T13:47:07.050000Z',
        value: 10.6,
        attr: 'temperature',
      },
      {
        device_id: '0998',
        ts: '2018-03-22T13:46:42.455000Z',
        value: 15.6,
        attr: 'temperature',
      },
      {
        device_id: '0998',
        ts: '2018-03-22T13:46:21.535000Z',
        value: 36.5,
        attr: 'temperature',
      }],
    },
    1: {
      data: [{
        attr: 'hue',
        value: '#4785FF',
        device_id: '8aa0f9',
        ts: '2020-05-06T16:48:50.408000Z',
        metadata: {},
      },
      {
        attr: 'hue',
        value: '#4785FF',
        device_id: '8aa0f9',
        ts: '2020-05-06T16:25:13.366000Z',
        metadata: {},
      },
      {
        attr: 'hue',
        value: '#414DE8',
        device_id: '8aa0f9',
        ts: '2020-05-06T16:25:06.697000Z',
        metadata: {},
      }],
    },
    2: [{
      attr: 'intensity',
      value: 5,
      device_id: '8aa0f9',
      ts: '2020-05-06T16:48:50.408000Z',
      metadata: {},
    }],
  };

  axios.mockResolvedValue('default value')
    .mockResolvedValueOnce(historyData[0])
    .mockResolvedValueOnce(devices[0])
    .mockResolvedValueOnce(historyData[1])
    .mockResolvedValueOnce(historyData[2])
    .mockResolvedValueOnce(devices[1]);

  const params = {
    filter: {
      devices: [{ deviceID: '0998', attrs: ['temperature'] }, { deviceID: '8aa0f9', attrs: ['hue', 'intensity'] }],
      lastN: 3,
    },
  };

  const result = await Resolvers.Query.getDeviceHistory({}, params);
  expect(result).toEqual([{
    attrs: [
      {
        label: 'temperature',
        timestamp: '2018-03-22T13:47:07.050000Z',
        value: 10.6,
        valueType: 'NUMBER',
      },
      {
        label: 'temperature',
        timestamp: '2018-03-22T13:46:42.455000Z',
        value: 15.6,
        valueType: 'NUMBER',
      },
      {
        label: 'temperature',
        timestamp: '2018-03-22T13:46:21.535000Z',
        value: 36.5,
        valueType: 'NUMBER',
      },
    ],
    deviceID: '0998',
    label: 'Thermometer',
  },
  {
    attrs: [
      {
        label: 'hue',
        timestamp: '2020-05-06T16:48:50.408000Z',
        value: '#4785FF',
        valueType: 'STRING',
      },
      {
        label: 'hue',
        timestamp: '2020-05-06T16:25:13.366000Z',
        value: '#4785FF',
        valueType: 'STRING',
      },
      {
        label: 'hue',
        timestamp: '2020-05-06T16:25:06.697000Z',
        value: '#414DE8',
        valueType: 'STRING',
      },
    ],
    deviceID: '8aa0f9',
    label: 'Living_Room',
  }]);
});

// testing formatValueType function
it('testing bool type', () => {
  const device = {
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'bool',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'bool',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: '0998' }, {}).then((output) => {
    expect(output).toEqual({
      id: '0998',
      label: 'Thermometer',
      attrs: [{
        label: 'temperature',
        type: 'BOOLEAN',
      }],
    });
  });
});


it('testing GEO type', () => {
  const device = {
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'geo:point',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'geo:point',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: '0998' }, {}).then((output) => {
    expect(output).toEqual({
      id: '0998',
      label: 'Thermometer',
      attrs: [{
        label: 'temperature',
        type: 'GEO',
      }],
    });
  });
});

it('testing UNDEFINED type', () => {
  const device = {
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'test',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'test',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: '0998' }, {}).then((output) => {
    expect(output).toEqual({
      id: '0998',
      label: 'Thermometer',
      attrs: [{
        label: 'temperature',
        type: 'UNDEFINED',
      }],
    });
  });
});

it('testing string type', () => {
  const device = {
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'string',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'string',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: '0998' }, {}).then((output) => {
    expect(output).toEqual({
      id: '0998',
      label: 'Thermometer',
      attrs: [{
        label: 'temperature',
        type: 'STRING',
      }],
    });
  });
});

it('should return history from 1 device', async () => {
  jest.mock('axios');

  const device = {
    data: {
      attrs: {
        1: [
          {
            created: '2020-03-09T17:10:34.364406+00:00',
            id: 1,
            is_static_overridden: false,
            label: 'temperature',
            metadata: [
              {
                created: '2020-03-09T17:10:34.369905+00:00',
                id: 2,
                'is_static´_overridden': false,
                label: 'protocol',
                static_value: 'mqtt',
                type: 'protocol',
                updated: null,
                value_type: 'string',
              },
            ],
            static_value: '',
            template_id: '1',
            type: 'dynamic',
            value_type: 'float',
          },
        ],
      },
      created: '2020-03-17T14:33:43.176756+00:00',
      id: '0998',
      label: 'Thermometer',
      templates: [
        1,
      ],
    },
  };

  const historyData = {
    0: {
      data: [{
        device_id: '0998',
        ts: '2018-03-22T13:47:07.050000Z',
        value: 10.6,
        attr: 'temperature',
      },
      {
        device_id: '0998',
        ts: '2018-03-22T13:46:42.455000Z',
        value: 15.6,
        attr: 'temperature',
      },
      {
        device_id: '0998',
        ts: '2018-03-22T13:46:21.535000Z',
        value: 36.5,
        attr: 'temperature',
      }],
    },
    1: {
      data: [{
        attr: 'hue',
        value: '#4785FF',
        device_id: '8aa0f9',
        ts: '2020-05-06T16:48:50.408000Z',
        metadata: {},
      },
      {
        attr: 'hue',
        value: '#4785FF',
        device_id: '8aa0f9',
        ts: '2020-05-06T16:25:13.366000Z',
        metadata: {},
      },
      {
        attr: 'hue',
        value: '#414DE8',
        device_id: '8aa0f9',
        ts: '2020-05-06T16:25:06.697000Z',
        metadata: {},
      }],
    },
    2: [{
      attr: 'intensity',
      value: 5,
      device_id: '8aa0f9',
      ts: '2020-05-06T16:48:50.408000Z',
      metadata: {},
    }],
  };

  axios.mockResolvedValue(null)
    .mockResolvedValueOnce(historyData[0])
    .mockResolvedValueOnce(device)
    .mockResolvedValueOnce(historyData[1])
    .mockResolvedValueOnce(historyData[2]);

  const params = {
    filter: {
      devices: [{ deviceID: '0998', attrs: ['temperature'] }, { deviceID: '8aa0f9', attrs: ['hue', 'intensity'] }],
      lastN: 3,
    },
  };

  const result = await Resolvers.Query.getDeviceHistory({}, params);
  expect(result).toEqual([{
    deviceID: '0998',
    label: 'Thermometer',
    attrs: [{
      label: 'temperature',
      valueType: 'NUMBER',
      value: 10.6,
      timestamp: '2018-03-22T13:47:07.050000Z',
    },
    {
      label: 'temperature',
      valueType: 'NUMBER',
      value: 15.6,
      timestamp: '2018-03-22T13:46:42.455000Z',
    },
    {
      label: 'temperature',
      valueType: 'NUMBER',
      value: 36.5,
      timestamp: '2018-03-22T13:46:21.535000Z',
    }],
  }]);
});

it('should return formatted device information', () => {
  const device = {
    attrs: {
      1: [
        {
          created: '2020-05-06T16:19:32.247307+00:00',
          id: 1,
          is_static_overridden: false,
          label: 'hue',
          static_value: '',
          template_id: '1',
          type: 'dynamic',
          value_type: 'string',
        },
        {
          created: '2020-05-06T16:19:32.397514+00:00',
          id: 2,
          is_static_overridden: false,
          label: 'intensity',
          static_value: '',
          template_id: '1',
          type: 'dynamic',
          value_type: 'integer',
        },
        {
          created: '2020-05-06T16:19:32.397514+00:00',
          id: 2,
          is_static_overridden: false,
          label: 'intensity',
          static_value: '',
          template_id: '1',
          type: 'static',
          value: 3,
          value_type: 'integer',
        },
      ],
    },
    created: '2020-05-06T16:19:46.185424+00:00',
    id: '8aa0f9',
    label: 'Living_Room',
    templates: [
      1,
    ],
  };

  const expectedResult = [{
    created: '2020-05-06T16:19:32.247307+00:00', id: 1, is_static_overridden: false, label: 'hue', static_value: '', template_id: '1', type: 'dynamic', value_type: 'STRING',
  }, {
    created: '2020-05-06T16:19:32.397514+00:00', id: 2, is_static_overridden: false, label: 'intensity', static_value: '', template_id: '1', type: 'dynamic', value_type: 'NUMBER',
  }];

  return expect(Resolvers.Device.attrs(device)).toEqual(expectedResult);
});
