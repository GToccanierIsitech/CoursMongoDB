#### Jeu de donnees: 
Telechargez ou generez un jeu de donnees de stations meteorologiques, qui incluent la date, la temperature, la pression atmospherique, etc.

Dataset ( Meteorological measurements / Poland / 2019-20 ): https://www.kaggle.com/datasets/krystianadammolenda/meteorological-measurements-poland-201920?resource=download


#### Preparation des donnees:
    a. Importez les donnees de stations meteorologiques dans MongoDB en utilisant la commande mongoimport.

```bash
./mongoimport --db meteo --collection meteorological --type csv --columnsHaveTypes --file Meteo.csv --fields "region.string(),day.date(2006-01-02),TempMax_Deg.decimal(),TempMin_Deg.decimal(),Wind_kmh.decimal(),Wet_percent.decimal(),Visibility_km.decimal(),CloudCoverage_percent.decimal(),pressure.decimal()"
```

    b. Assurez-vous que les donnees sont bien structurees et propres pour une utilisation ulterieure.

Pour structurée les données afin que l'on puisse faire tout les exercices avec, j'ai du modifier le fichier CSV avec le code suivant (en node.js) :
```js
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
```

#### Indexation avec MongoDB:
    a. Creez un index sur le champ de la date pour ameliorer les performances de la recherche. Utilisez la methode createIndex ().
```bash
db.meteorological.createIndex({"day": -1})
```

Result:
```bash
day_-1
```


    b. Verifiez que l'index a ete cree en utilisant la methode listIndexes ().
```bash
db.runCommand (   
	{      
		listIndexes: "meteorological",
	}
)
```

Result :
```bash
{
  cursor: {
    id: Long("0"),
    ns: 'meteo.meteorological',
    firstBatch: [
      { v: 2, key: { _id: 1 }, name: '_id_' },
      { v: 2, key: { day: -1 }, name: 'day_-1' }
    ]
  },
  ok: 1
}
```


#### Requetes MongoDB:
    a. Recherchez les stations meteorologiques qui ont enregistre une temperature superieure a 25°C pendant les mois d'ete (juin a aout). Utilisez la methode find () et les operateurs de comparaison pour trouver les documents qui correspondent a vos criteres.
```bash
db.meteorological.find({'TempMax_Deg': {$gt : 25 }, 'day': {$gte: new Date("2018-06-01"), $lte: new Date("2018-08-31")}})
```

Result:
```bash
[
  {
    _id: ObjectId("63e4bbd14e31320bce16797f"),
    region: 'Nouvelle-Aquitaine',
    day: ISODate("2018-08-31T00:00:00.000Z"),
    TempMax_Deg: 25.333333333333332,
    TempMin_Deg: 19.333333333333332,
    Wind_kmh: 12.666666666666666,
    Wet_percent: 54,
    Visibility_km: 9.666666666666666,
    CloudCoverage_percent: 1.3333333333333333,
    pressure: 90
  },
  {
    _id: ObjectId("63e4bbd14e31320bce16799d"),
    region: 'Occitanie',
    day: ISODate("2018-08-31T00:00:00.000Z"),
    TempMax_Deg: 26.5,
    TempMin_Deg: 21.5,
    Wind_kmh: 18.5,
    Wet_percent: 50,
    Visibility_km: 10,
    CloudCoverage_percent: 14,
    pressure: 10
  },
  {
    _id: ObjectId("63e4bbd14e31320bce1679bb"),
    region: 'Pays de la Loire',
    day: ISODate("2018-08-31T00:00:00.000Z"),
    TempMax_Deg: 26,
    TempMin_Deg: 21,
    Wind_kmh: 9,
    Wet_percent: 57,
    Visibility_km: 10,
    CloudCoverage_percent: 2,
    pressure: 142
  },
  ...
]
```

    b. Triez les stations meteorologiques par pression atmospherique, du plus eleve au plus bas. Utilisez la methode sort () pour trier les resultats.
```bash
db.meteorological.find().sort({"pressure":-1})
```

```bash
[
  {
    _id: ObjectId("63e4bbd04e31320bce166d40"),
    region: 'Bourgogne-Franche-Comté',
    day: ISODate("2020-09-15T00:00:00.000Z"),
    TempMax_Deg: 29,
    TempMin_Deg: 17,
    Wind_kmh: 11.5,
    Wet_percent: 75.5,
    Visibility_km: 9.4375,
    CloudCoverage_percent: 57.5,
    pressure: 200
  },
  {
    _id: ObjectId("63e4bbd04e31320bce166d8c"),
    region: 'Corse',
    day: ISODate("2020-09-01T00:00:00.000Z"),
    TempMax_Deg: 24,
    TempMin_Deg: 15,
    Wind_kmh: 10,
    Wet_percent: 64,
    Visibility_km: 10,
    CloudCoverage_percent: 17,
    pressure: 200
  },
  {
    _id: ObjectId("63e4bbd04e31320bce166db6"),
    region: 'Grand Est',
    day: ISODate("2020-09-13T00:00:00.000Z"),
    TempMax_Deg: 29,
    TempMin_Deg: 16,
    Wind_kmh: 6.5,
    Wet_percent: 79,
    Visibility_km: 10,
    CloudCoverage_percent: 24,
    pressure: 200
  },
  ...
]
```


#### Framework d'agregation:
    a. Calculez la temperature moyenne par station meteorologique pour chaque mois de l'annee. Utilisez le framework d'agregation de MongoDB pour effectuer des calculs sur les donnees et grouper les donnees par mois.
```bash
var pipeline = [
{
	$group: {
		"_id": { 
			"month": { 
				'$month': '$day' 
			},
			"region": '$region',
		},
		"temperatureMoyenne": { 
			$avg: {
				$divide: [{
					$sum: ["$TempMax_Deg", "$TempMin_Deg"]
				}, 2]
			}
		}
	}
},
{
	$sort: {
		"_id.region" : 1,
		"_id.month" : 1
	}
}]
	
db.meteorological.aggregate(pipeline)
```

Result :
```bash
[
  {
    _id: { month: 1, region: 'Bourgogne-Franche-Comté' },
    temperatureMoyenne: 4.93010752688172
  },
  {
    _id: { month: 2, region: 'Bourgogne-Franche-Comté' },
    temperatureMoyenne: 5.997058823529412
  },
  {
    _id: { month: 3, region: 'Bourgogne-Franche-Comté' },
    temperatureMoyenne: 8.56989247311828
  },
  {
    _id: { month: 4, region: 'Bourgogne-Franche-Comté' },
    temperatureMoyenne: 14.16388888888889
  },
  ...
]
```


    b. Trouvez la station meteorologique qui a enregistre la plus haute temperature en ete. Utilisez le framework d'agregation de MongoDB pour effectuer des calculs sur les donnees et trouver la valeur maximale.
```bash
var pipeline = [
{ 
	$match: { 
		"day": {$gte: new Date("2018-06-21"), $lte: new Date("2018-09-22")}
	} 
}, 
{ 
	$sort: { 
		'TempMax_Deg': -1 
	} 
}, 
{ 
	$limit: 1 
}]
	
db.meteorological.aggregate(pipeline)
```

Result:
```bash
[
  {
    _id: ObjectId("63e4bbd14e31320bce167894"),
    region: 'Île-de-France',
    day: ISODate("2018-08-06T00:00:00.000Z"),
    TempMax_Deg: 36,
    TempMin_Deg: 30,
    Wind_kmh: 17,
    Wet_percent: 39,
    Visibility_km: 9,
    CloudCoverage_percent: 19,
    pressure: 81
  }
]
```

#### Export de la base de donnees:
    a. Exportez les resultats des requetes dans un fichier CSV pour un usage ulterieur. Utilisez la commande mongoexport pour exporter des donnees de MongoDB.
```bash
mongoexport --db meteo --collection meteorological --type csv --fields _id,region,day,TempMax_Deg,TempMin_Deg,Wind_kmh,Wet_percent,Visibility_km,CloudCoverage_percent,pressure --out meteometeorologicalexport.csv
```

Result:
```bash
2023-02-09T13:51:33.357+0100    connected to: mongodb://localhost/
2023-02-09T13:51:33.622+0100    exported 13152 records
```