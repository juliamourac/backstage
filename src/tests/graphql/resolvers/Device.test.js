const axios = require('axios');
const Resolvers = require('../../../graphql/device/Resolvers');
const { device1, deviceReading, deviceList} = require('../../apiMock/device');

jest.mock('axios');

afterEach(() => {
  axios.mockReset();
});

it('should get a device', () => {
  const root = {};
  const params = { deviceId: "124e15" };
  const context = {};

  axios.mockImplementationOnce(() => Promise.resolve({ data: device1 }));

  return Resolvers.Query.getDeviceById(root, params, context).then((output) => {
    expect(output).toEqual(device1)
  });
});


it('should get a list of devices', () => {
  axios.mockImplementationOnce(() => Promise.resolve({ data: deviceList }));
  const root = {};
  const params = { page: { number: 1, size: 4 }, filter: { label: "d" } };

  return Resolvers.Query.getDevices(root, params).then((output) => {
    expect(output).toEqual(deviceList)
  });
});

it('should return a list of history entries', async () => {

  jest.mock('axios');

  const root = {};
  const params = {
    filter: {
      devices: [{ deviceID: "0998", attrs: ["temperature"] }],
      lastN: 3,
    }
  };

  const devReading = {'data': [{
    "device_id": "0998",
    "ts": "2018-03-22T13:47:07.050000Z",
    "value": 10.6,
    "attr": "temperature"
  },
  {
    "device_id": "0998",
    "ts": "2018-03-22T13:46:42.455000Z",
    "value": 15.6,
    "attr": "temperature"
  },
  {
    "device_id": "0998",
    "ts": "2018-03-22T13:46:21.535000Z",
    "value": 36.5,
    "attr": "temperature"
  }]};
  const dev = {'data': {
    "attrs": {
      "1": [
        {
          "created": "2020-03-09T17:10:34.364406+00:00",
          "id": 1,
          "is_static_overridden": false,
          "label": "temperature",
          "metadata": [
            {
              "created": "2020-03-09T17:10:34.369905+00:00",
              "id": 2,
              "is_static´_overridden": false,
              "label": "protocol",
              "static_value": "mqtt",
              "type": "protocol",
              "updated": null,
              "value_type": "string"
            }
          ],
          "static_value": "",
          "template_id": "1",
          "type": "dynamic",
          "value_type": "float"
        }
      ],
    },
    "created": "2020-03-17T14:33:43.176756+00:00",
    "id": "0998",
    "label": "Thermometer",
    "templates": [
      1
    ]
  }};

    axios.mockResolvedValue('default value')
    .mockResolvedValueOnce(devReading)
    .mockResolvedValueOnce(dev);

  const expectedResult = [{
    deviceID: "0998",
    label: "Thermometer",
    attrs: [{
      "label": "temperature",
      "valueType": "NUMBER",
      "value": 10.6,
      "timestamp": "2018-03-22T13:47:07.050000Z",
    },
    {
      "label": "temperature",
      "valueType": "NUMBER",
      "value": 15.6,
      "timestamp": "2018-03-22T13:46:42.455000Z",
    },
    {
      "label": "temperature",
      "valueType": "NUMBER",
      "value": 36.5,
      "timestamp": "2018-03-22T13:46:21.535000Z",
    }]
  }];

  const result = await Resolvers.Query.getDeviceHistory(root,params);
  expect(result).toEqual(expectedResult);
});

it('should return empty array', async () => {
  jest.mock('axios');

  const root = {};
  const params = {
    filter: {
      devices: [{ deviceID: "0998", attrs: ["temperature"] }],
      lastN: 3,
    }
  };
  
  axios.mockResolvedValue('default value')
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce(deviceReading);

  const result = await Resolvers.Query.getDeviceHistory(root,params);
  expect(result).toEqual([ ]);
});

it('should return history from 2 devices', async () => {
  jest.mock('axios');

  const devices = [{
    'data': {
      "attrs": {
        "1": [
          {
            "created": "2020-03-09T17:10:34.364406+00:00",
            "id": 1,
            "is_static_overridden": false,
            "label": "temperature",
            "metadata": [
              {
                "created": "2020-03-09T17:10:34.369905+00:00",
                "id": 2,
                "is_static´_overridden": false,
                "label": "protocol",
                "static_value": "mqtt",
                "type": "protocol",
                "updated": null,
                "value_type": "string"
              }
            ],
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "float"
          }
        ],
      },
      "created": "2020-03-17T14:33:43.176756+00:00",
      "id": "0998",
      "label": "Thermometer",
      "templates": [
        1
      ]
    }
  }, {
    'data': {
      "attrs": {
        "1": [
          {
            "created": "2020-05-06T16:19:32.247307+00:00",
            "id": 1,
            "is_static_overridden": false,
            "label": "hue",
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "string"
          },
          {
            "created": "2020-05-06T16:19:32.397514+00:00",
            "id": 2,
            "is_static_overridden": false,
            "label": "intensity",
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "integer"
          }
        ]
      },
      "created": "2020-05-06T16:19:46.185424+00:00",
      "id": "8aa0f9",
      "label": "Living_Room",
      "templates": [
        1
      ]
    }
  }];

  const historyData = [[{
    "label": "temperature",
    "valueType": "NUMBER",
    "value": 10.6,
    "timestamp": "2018-03-22T13:47:07.050000Z",
  },
  {
    "label": "temperature",
    "valueType": "NUMBER",
    "value": 15.6,
    "timestamp": "2018-03-22T13:46:42.455000Z",
  },
  {
    "label": "temperature",
    "valueType": "NUMBER",
    "value": 36.5,
    "timestamp": "2018-03-22T13:46:21.535000Z",
  }], [{
    "attr": "hue",
    "value": "#4785FF",
    "device_id": "8aa0f9",
    "ts": "2020-05-06T16:48:50.408000Z",
    "metadata": {}
  },
  {
    "attr": "hue",
    "value": "#4785FF",
    "device_id": "8aa0f9",
    "ts": "2020-05-06T16:25:13.366000Z",
    "metadata": {}
  },
  {
    "attr": "hue",
    "value": "#414DE8",
    "device_id": "8aa0f9",
    "ts": "2020-05-06T16:25:06.697000Z",
    "metadata": {}
  }], [{
    "attr": "intensity",
    "value": 5,
    "device_id": "8aa0f9",
    "ts": "2020-05-06T16:48:50.408000Z",
    "metadata": {}
  }]];

  axios.mockResolvedValue('default value')
    .mockResolvedValueOnce(historyData[0])
    .mockResolvedValueOnce(devices[0])
    .mockResolvedValueOnce(historyData[1])
    .mockResolvedValueOnce(historyData[2])
    .mockResolvedValueOnce(devices[1]);

    const params = {filter:{
      devices: [{deviceID: "0998", attrs:["temperature"]},{deviceID: "8aa0f9", attrs:["hue","intensity"]}],
      lastN:3
    }};

    const result = await Resolvers.Query.getDeviceHistory({},params);
    expect(result).toEqual([]);
});

//testing formatValueType function
it('testing bool type', () => {
  const device = {
    'data': {
      "attrs": {
        "1": [
          {
            "created": "2020-03-09T17:10:34.364406+00:00",
            "id": 1,
            "is_static_overridden": false,
            "label": "temperature",
            "metadata": [
              {
                "created": "2020-03-09T17:10:34.369905+00:00",
                "id": 2,
                "is_static´_overridden": false,
                "label": "protocol",
                "static_value": "mqtt",
                "type": "protocol",
                "updated": null,
                "value_type": "bool"
              }
            ],
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "bool"
          }
        ],
      },
      "created": "2020-03-17T14:33:43.176756+00:00",
      "id": "0998",
      "label": "Thermometer",
      "templates": [
        1
      ]
    }
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: "0998" }, {}).then((output) => {
    expect(output).toEqual({
      id: "0998",
      label: "Thermometer",
      attrs: [{
        label: "temperature",
        type: "BOOLEAN"
      }]
    })
  });
});


it('testing GEO type', () => {
  const device = {
    'data': {
      "attrs": {
        "1": [
          {
            "created": "2020-03-09T17:10:34.364406+00:00",
            "id": 1,
            "is_static_overridden": false,
            "label": "temperature",
            "metadata": [
              {
                "created": "2020-03-09T17:10:34.369905+00:00",
                "id": 2,
                "is_static´_overridden": false,
                "label": "protocol",
                "static_value": "mqtt",
                "type": "protocol",
                "updated": null,
                "value_type": "geo:point"
              }
            ],
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "geo:point"
          }
        ],
      },
      "created": "2020-03-17T14:33:43.176756+00:00",
      "id": "0998",
      "label": "Thermometer",
      "templates": [
        1
      ]
    }
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: "0998" }, {}).then((output) => {
    expect(output).toEqual({
      id: "0998",
      label: "Thermometer",
      attrs: [{
        label: "temperature",
        type: "GEO"
      }]
    })
  });
});

it('testing UNDEFINED type', () => {
  const device = {
    'data': {
      "attrs": {
        "1": [
          {
            "created": "2020-03-09T17:10:34.364406+00:00",
            "id": 1,
            "is_static_overridden": false,
            "label": "temperature",
            "metadata": [
              {
                "created": "2020-03-09T17:10:34.369905+00:00",
                "id": 2,
                "is_static´_overridden": false,
                "label": "protocol",
                "static_value": "mqtt",
                "type": "protocol",
                "updated": null,
                "value_type": "test"
              }
            ],
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "test"
          }
        ],
      },
      "created": "2020-03-17T14:33:43.176756+00:00",
      "id": "0998",
      "label": "Thermometer",
      "templates": [
        1
      ]
    }
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: "0998" }, {}).then((output) => {
    expect(output).toEqual({
      id: "0998",
      label: "Thermometer",
      attrs: [{
        label: "temperature",
        type: "UNDEFINED"
      }]
    })
  });
});

it('testing string type', () => {
  const device = {
    'data': {
      "attrs": {
        "1": [
          {
            "created": "2020-03-09T17:10:34.364406+00:00",
            "id": 1,
            "is_static_overridden": false,
            "label": "temperature",
            "metadata": [
              {
                "created": "2020-03-09T17:10:34.369905+00:00",
                "id": 2,
                "is_static´_overridden": false,
                "label": "protocol",
                "static_value": "mqtt",
                "type": "protocol",
                "updated": null,
                "value_type": "string"
              }
            ],
            "static_value": "",
            "template_id": "1",
            "type": "dynamic",
            "value_type": "string"
          }
        ],
      },
      "created": "2020-03-17T14:33:43.176756+00:00",
      "id": "0998",
      "label": "Thermometer",
      "templates": [
        1
      ]
    }
  };

  axios.mockImplementationOnce(() => Promise.resolve(device));

  return Resolvers.Query.getDeviceById({}, { deviceId: "0998" }, {}).then((output) => {
    expect(output).toEqual({
      id: "0998",
      label: "Thermometer",
      attrs: [{
        label: "temperature",
        type: "STRING"
      }]
    })
  });
});