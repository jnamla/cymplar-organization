var config = {};

//config.mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/cymplar';
//uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||  "mongodb://neilNeuli:neil2015@ds043981.mongolab.com:43981/cymplar"
config.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||  "mongodb://localhost:27017/cymplar"
};

config.secretKey = "cymplarSecret";

module.exports = config;