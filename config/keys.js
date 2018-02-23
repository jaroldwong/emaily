// set automatically to 'production' on heroku
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  // return development keys
  module.exports = require('./dev');
}
