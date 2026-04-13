const mongoose = require('mongoose');
const User = require('./models/users.js');
const dotenv = require('dotenv');
dotenv.config();

async function checkIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const indexes = await User.collection.getIndexes();
        console.log(JSON.stringify(indexes, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkIndexes();
