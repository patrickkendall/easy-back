const mongoose = require("mongoose");

// Replace this with your MONGOURI.
//const MONGOURI = "mongodb+srv://pimpmastashaft:mongoSucks123@cluster0.srixcgi.mongodb.net/test?authSource=admin&replicaSet=atlas-ihbojm-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
//
const MONGOURI = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
