const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log(`Database Connected SuccessFully..`);
})
.catch((err)=>{
    console.log(`Database is Not Connected Due to ${err}`);
})