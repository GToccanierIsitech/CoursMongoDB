const Meteorological = require('../models/meteorologicalModel')
const { MongoClient } = require("mongodb");

/*********************************************************** Requete Get ***********************************************************/
// Récupère tous les utilisateurs
exports.get = (req, res) => {
    MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true })
        .then(client => {
            const db = client.db();
            const collection = db.collection("meteorological");
            collection
                .find({})
                .toArray()
                .then(docs => {
                    res.status(200).send(docs);
                    client.close();
                })
                .catch(error => {
                    res.status(500).send(error);
                    client.close();
                });
        })
        .catch(error => {
            res.status(500).send(error);
        });
}