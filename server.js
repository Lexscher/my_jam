//  Require dependencies
const logger = require('logger');
const express = require('express');

//  use express
const app = express();

// set our port
const port = process.env.PORT || 3000;
app.set('port', port)

// middlewares
app.use(logger('dev'))


// Run our server
app.listen(port, () =>
  console.log(`Express application running on port ${port}`)
);
