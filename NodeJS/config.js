module.exports = {
  MONGO_DATABASE_USERNAME: "admin",
  MONGO_DATABASE_PASSWORD: "admin1",
  MONGO_DATABASE_URL: "@ds261460.mlab.com:61460/iot_final",
  APP_SECRET_KEY: "Khang.Pham",
  API_PUSH_NOTIC: "http://localhost:3000",
  API_CLOUD: "http://localhost:3000",
  BASE_URL: "localhost",
  TYPE: "http",
  PORT: "3000",
  SWAGGER: {
    APIS_PATH: ['./api/device/*.js', './api/socket/*.js'],
    APIS_TAG: [{
      name: "Devices",
      description: "APIs for manage device"
    }, {
      name: "Socket",
      description: "Socket server for transmit data"
    }]
  }
};