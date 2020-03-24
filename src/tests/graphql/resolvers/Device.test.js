const axios = require('axios');
const Resolvers = require('../../../graphql/device/Resolvers');
const { device1, deviceHello, deviceList } = require('../../apiMock/device');

jest.mock('axios');

afterEach(() => {
  axios.mockReset();
});

it('get device', () => {
  const root = {};
  const params = {deviceId: "124e15"};
  const context = {};

  axios.mockImplementationOnce(() => Promise.resolve({data: device1}));

  return Resolvers.Query.getDeviceById(root, params, context).then((output) => {
    expect(output).toEqual(device1)
  });
});


it('should get a list of devices', () => {
  axios.mockImplementationOnce(() => Promise.resolve({data: deviceList}));
  const root = {};
  const params = {label: "d"};

  return Resolvers.Query.getDevices(root, params).then((output) => {
    expect(output).toEqual(deviceList)
  });
});