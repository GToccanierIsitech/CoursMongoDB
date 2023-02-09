const fs = require("fs");
const csv = require("fast-csv");
const csvParser = require("csv-parser");

const inputFile = "./file/meteomerge.csv";
const outputFile = "./file/output.csv";

let Format = []

fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on("data", (data) => {
        // Modifier la date
        let object = data
        object.day = (new Date(Date.parse(data.day)).toISOString()).split('T')[0]
        // Ajouter la pression
        object.pressure = Math.floor(Math.random() * (200 - 0 + 1)).toString()
        // Ajoute du format
        Format.push(object)
    })
    .on("end", () => {
        console.log("Fin de la lecture du fichier");
        console.log(Format)
        // Sauvegarde
        const ws = fs.createWriteStream(outputFile);
        csv
            .write(Format, { headers: true })
            .pipe(ws)
            .on("finish", function () {
                console.log("Fin de l'écriture dans le fichier");
            });
    });


