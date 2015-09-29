var config = {};

//config.mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/cymplar';

config.mongodb = {
  uri: process.env.MONGOLAB_URI ||  "mongodb://root:password@ds043981.mongolab.com:43981/cymplar"
};

config.secretKey = "cymplarSecret";

module.exports = config;