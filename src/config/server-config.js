const dotenv=require('dotenv');
const path = require('path');

dotenv.config({path:path.join(__dirname,'../../.env')}); 

module.exports = {
    PORT: process.env.PORT
}