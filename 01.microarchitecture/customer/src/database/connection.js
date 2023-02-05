const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async () => {
  try {
    // depreated 옵션 false
    mongoose.set('strictQuery', false);

    await mongoose.connect(DB_URL, {
      // useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    });
    console.log('Db Connected');
  } catch (error) {
    console.log('Error ============');
    console.log(error);
    process.exit(1);
  }
};
