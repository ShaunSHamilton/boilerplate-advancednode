require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main(callback) {
    const URI = process.env.MONGO_URI;
    console.log(URI)

    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await callback(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports = main;