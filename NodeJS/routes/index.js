var express = require('express');
var router = express.Router();
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var cf = require('../config');
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'RESTful API with Swagger',
    contact: {
      email: "khangpqmse0086@fpt.edu.vn",
      phone: "0981604050"
    }
  },
  host: require('../server/config').getRootUrl,
  basePath: '/api',
  tags: cf.SWAGGER.APIS_TAG
};


var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: cf.SWAGGER.APIS_PATH
};
// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
