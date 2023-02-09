// Importation du module MongoDB
const MongoClient = require("mongodb").MongoClient;

const mongoDB = process.env.MONGO_URL || null;

const client = new MongoClient(process.env.MONGO_URL, { monitorCommands: true });

client.on('commandStarted', started => console.log(started));
client.db().collection('pets');
await client.insertOne({ name: 'spot', kind: 'dog' });