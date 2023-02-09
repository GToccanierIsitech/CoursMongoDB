const fs = require("fs");
const csv = require("fast-csv");
const csvParser = require("csv-parser");
// Emplacement du fichier avec les informations avans modifications
const inputFile = "./file/meteomerge.csv";
// Emplacement de sortie du nouveau fichier
const outputFile = "./file/output.csv";

// Tableau qui contiendra toutes les données pendant le transfert et le traitement
let Format = []

fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on("data", (data) => {
        // Création objets temporaire qui récupère les informations du fichier
        let object = data
        // Modification de la date
        object.day = (new Date(Date.parse(data.day)).toISOString()).split('T')[0]
        // Ajout du champs pression
        object.pressure = Math.floor(Math.random() * (200 - 0 + 1)).toString()
        // Envoie de l'objet dans le tableau contenant les données modifier
        Format.push(object)
    })
    .on("end", () => {
        // Création du nouveau fichier avec les infomation contenu dans le tableau "Format"
        const ws = fs.createWriteStream(outputFile);
        csv
            .write(Format, { headers: true })
            .pipe(ws)
            .on("finish", function () {
                // Ecriture d'un message dans la console pour nous informer que c'est fini
                console.log("Fin de l'écriture dans le fichier");
            });
    });