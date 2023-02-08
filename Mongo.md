
# Exercice : Exobook.md

Créez une base de données sample nommée "sample_db" et une collection appelée "employees".

```bash
use sample_db
```

Insérez les documents suivants dans la collection "employees":

```bash
db.employees.insertMany([{ name: "John Doe", age: 35, job: "Manager", salary: 80000},{ name: "Jane Doe", age: 32, job: "Developer", salary: 75000},{ name: "Jim Smith", age: 40, job: "Manager", salary: 85000}])
```


1) Écrivez une requête MongoDB pour trouver tous les documents dans la collection "employees".
```bash
db.employees.find()
```

2) Écrivez une requête pour trouver tous les documents où l'âge est supérieur à 33.
```bash
db.employees.find({"age" : { $gt: 33 }}) 
```

3) Écrivez une requête pour trier les documents dans la collection "employees" par salaire décroissant.
```bash
db.employees.find().sort({"salary":-1})
```

https://www.mongodb.com/docs/manual/reference/method/cursor.sort/

4) Écrivez une requête pour sélectionner uniquement le nom et le job de chaque document.
```bash
db.employees.find({}, {"_id": 0, "name": 1, "job": 1})
```

5) Écrivez une requête pour compter le nombre d'employés par poste.
```bash
db.employees.aggregate({ $group : { _id : '$job', count : { $sum : 1 } } })
```

6) Écrivez une requête pour mettre à jour le salaire de tous les développeurs à 80000.
```bash
db.employees.updateMany({"job": "Developer"}, { $set: {"salary": 80000} })
```

# Exercice : Exo.md

1) Affichez l’identifiant et le nom des salles qui sont des SMAC.
```bash 
db.salles.find({"smac": {$eq: true}}, {nom: 1})
```


2) Affichez le nom des salles qui possèdent une capacité d’accueil strictement supérieure à 1000 places.
```bash
db.salles.find({"capacite" : { $gt: 1000 }}, {_id: 0, nom: 1}) 
```

3) Affichez l’identifiant des salles pour lesquelles le champ adresse ne comporte pas de numéro.
```bash
db.salles.find({"adresse.numero" : { $exists: false }}, {_id: 1})
```
  
4) Affichez l’identifiant puis le nom des salles qui ont exactement un avis.
```bash
db.salles.find({"avis" : { $size: 1 }}, {_id: 1, nom: 1}) 
```
  
5) Affichez tous les styles musicaux des salles qui programment notamment du blues.
```bash
db.salles.find({"styles": "blues"}, {_id: 0, styles: 1}) 
```
  
6) Affichez tous les styles musicaux des salles qui ont le style « blues » en première position dans leur tableau styles.
```bash
db.salles.find({"styles.0": "blues"}, {_id: 0, styles: 1}) 
```

7) Affichez la ville des salles dont le code postal commence par 84 et qui ont une capacité strictement inférieure à 500 places (pensez à utiliser une expression régulière).
```bash
db.salles.find({"adresse.codePostal": {$regex: "^84"}, "capacite" : {$lt: 500}}, {_id: 0, "adresse.ville": 1}) 
```
  https://www.mongodb.com/docs/manual/reference/operator/query/regex/
  
8) Affichez l’identifiant pour les salles dont l’identifiant est pair ou le champ avis est absent.
```bash
db.salles.find({ $or: [{"_id": {$mod: [2,0]}}, {"avis": {$exists:false}}]}, {"_id": 1})
```
  https://www.mongodb.com/docs/manual/reference/operator/query/or/
  
9) Affichez le nom des salles dont au moins un des avis comporte une note comprise entre 8 et 10 (tous deux inclus).
```bash
db.salles.find({"avis.note": {$gte: 8, $lte: 10}}, {"_id": 0, "nom": 1})

#Apres le cours de mardi
db.salles.find({"avis": {$elemMatch: { "note": { $gte: 8, $lte: 10 }}}}, {"_id": 0, "nom": 1})
```

10) Affichez le nom des salles dont au moins un des avis comporte une date postérieure au 15/11/2019 (pensez à utiliser le type JavaScript Date).
```bash
db.salles.find({"avis.date": {$gt: new Date('2019-11-15')}}, {"_id": 0, "nom": 1})
```
  
11) Affichez le nom ainsi que la capacité des salles dont le produit de la valeur de l’identifiant par 100 est strictement supérieur à la capacité.
```bash
db.salles.find({ $where: "(this._id * 100) > this.capacite" }, { "_id": false, "nom": true, "capacite": true })

db.salles.find({ $expr: { $gt: [{ $multiply: ["$_id", 100] }, "$capacite"] } }, { "_id": false, "nom": true, "capacite": true })
```
  https://www.mongodb.com/docs/manual/reference/operator/query/where/
  
12) Affichez le nom des salles de type SMAC programmant plus de deux styles de musiques différents en utilisant l’opérateur $where qui permet de faire usage de JavaScript.
```bash
db.salles.find({ $where: "this.styles && this.styles.length >= 2 && this.smac" }, { "_id": 0, "nom": 1 })
```
  
13) Affichez les différents codes postaux présents dans les documents de la collection salles.
```bash
db.salles.find({}, {"_id": 0, "adresse.codePostal": 1})
```

14) Mettez à jour tous les documents de la collection salles en rajoutant 100 personnes à leur capacité actuelle.
```bash
db.salles.updateMany({} ,{ $inc: {"capacite" : 100}})
```

15) Ajoutez le style « jazz » à toutes les salles qui n’en programment pas.
```bash
db.salles.updateMany({"styles": {$ne: "jazz"}} ,{ $push: {"styles": "jazz"}})
# Après le cours de mardi
db.salles.updateMany({} ,{ $addToSet: {"styles": "jazz"}})
```
https://www.mongodb.com/docs/manual/reference/operator/update/push/#mongodb-update-up.-push
https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/

16) Retirez le style «funk» à toutes les salles dont l’identifiant n’est égal ni à 2, ni à 3.
```bash
db.salles.updateMany({"_id": {$nin: [2, 3]}} ,{ $pull: {"styles": "funk"}})
```

17) Ajoutez un tableau composé des styles «techno» et « reggae » à la salle dont l’identifiant est 3.
```bash
db.salles.updateOne({"_id": {$eq: 3}} ,{ $push: {"styles": ["techno", "reggae"]}})
```

18) Pour les salles dont le nom commence par la lettre P (majuscule ou minuscule), augmentez la capacité de 150 places et rajoutez un champ de type tableau nommé contact dans lequel se trouvera un document comportant un champ nommé telephone dont la valeur sera « 04 11 94 00 10 ».
```bash
db.salles.updateMany({"nom" : {$regex: "^[Pp]"}}, { $inc: {"capacite" : 100}, $set: { "contact": [{"telephone": "04 11 94 00 10"}]}})
```

19) Pour les salles dont le nom commence par une voyelle (peu importe la casse, là aussi), rajoutez dans le tableau avis un document composé du champ date valant la date courante et du champ note valant 10 (double ou entier). L’expression régulière pour chercher une chaîne de caractères débutant par une voyelle suivie de n’importe quoi d’autre est ^aeiou+$.
```bash
db.salles.updateMany({"nom": {$regex: "^[aeiouyAEIOUY]"}}, {$push: {"avis": {"date": new Date(), "note": 10}}})
```
  

20) En mode upsert, vous mettrez à jour tous les documents dont le nom commence par un z ou un Z en leur affectant comme nom « Pub Z », comme valeur du champ capacite 50 personnes (type entier et non décimal) et en positionnant le champ booléen smac à la valeur « false ».
```bash
db.salles.updateOne({"nom": {$regex: "^[Zz]"}}, {$set: {"nom": "Pub Z", "capacite": 50,"smac": false}}, {"upsert": true})
```

21) Affichez le décompte des documents pour lesquels le champ id est de type « objectId ».
```bash
db.salles.find({"_id": {$type: "objectId"}}).count()

db.salles.countDocuments({"_id": {$type: "objectId"}})
```
https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/

22) Pour les documents dont le champ id n’est pas de type « objectId », affichez le nom de la salle ayant la plus grande capacité. Pour y parvenir, vous effectuerez un tri dans l’ordre qui convient tout en limitant le nombre de documents affichés pour ne retourner que celui qui comporte la capacité maximale.
```bash
db.salles.find({"_id": {$not: {$type: "objectId"}}}, {"_id": 0, "nom": 1}).sort({"capacite":-1}).limit(1)
```
  

23) Remplacez, sur la base de la valeur de son champ id, le document créé à l’exercice 20 par un document contenant seulement le nom préexistant et la capacité, que vous monterez à 60 personnes.
```bash
db.salles.updateOne({"_id": ObjectId("63e22ed43dc0a8b43bdd4414")}, {$set: {"capacite": 60}, $unset: {"smac": ""}})
# Avec replaceOne
db.salles.replaceOne({"_id": ObjectId("63e22ed43dc0a8b43bdd4414")}, {"nom": "Pub Z", "capacite": 60})
```
https://www.mongodb.com/docs/manual/reference/method/db.collection.replaceOne/

24) Effectuez la suppression d’un seul document avec les critères suivants : le champ id est de type « objectId » et la capacité de la salle est inférieure ou égale à 60 personnes.
```bash
db.salles.deleteOne({"_id": {$type: "objectId"}, "capacite": {$gte: 60}})
```
  

25) À l’aide de la méthode permettant de trouver un seul document et de le mettre à jour en même temps, réduisez de 15 personnes la capacité de la salle située à Nîmes.
```bash
db.salles.findOneAndUpdate({"adresse.ville": {$eq: "Nîmes"}}, { $inc: {"capacite" : -15}})
```
https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/
# Exercice : Validation.md

## Exercice 1

Modifiez la collection salle afin que soient dorénavant validés les documents destinés à y être insérés ; cette validation aura lieu en mode « strict » et portera sur les champs suivants :
- nom sera obligatoire et devra être de type chaîne de caractères.
- capacite sera obligatoire et devra être de type entier (int).
- Dans le champ adresse, les champs codePostal et ville, tous deux de type chaîne de caractères, seront obligatoires.

Validation 
```bash
var proprietes = {
	"nom": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	},
	"capacite": {
		"bsonType": "int", 
		"description": "int obligatoire" 
	},
	"adresse.codePostal": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	},
	"adresse.ville": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	}
}

db.runCommand( { "collMod": "salles", "validator": { $jsonSchema: { "bsonType": "object", "required": ["nom", "capacite", "adresse.codePostal", "adresse.ville"], "properties": proprietes } } })
```

Que constatez-vous lors de la tentative d’insertion suivante, et quelle en est la cause ?

```bash
db.salles.insertOne({"nom": "Super salle", "capacite": 1500, "adresse": {"ville": "Musiqueville"}})
```

	Apres avoir rentrer la requete ci-dessus on obtient l'erreur suivante:
```bash
Uncaught:
MongoServerError: Document failed validation
Additional information: {
  failingDocumentId: ObjectId("63e24f95e985d5219fb67844"),
  details: {
    operatorName: '$jsonSchema',
    schemaRulesNotSatisfied: [
      {
        operatorName: 'required',
        specifiedAs: {
          required: [ 'nom', 'capacite', 'adresse.codePostal', 'adresse.ville' ]
        },
        missingProperties: [ 'adresse.codePostal' ]
      }
    ]
  }
}
```

	On peux voir qu'il manque le code postal dans la requete d'insertion 

Que proposez-vous pour régulariser la situation ?

	On rajoute un code postal dans l'objet adresse de la requete :
```bash
db.salles.insertOne({"nom": "Super salle", "capacite": 1500, "adresse": {"codePostal": "","ville": "Musiqueville"}})
```
	Ca fonctionne le document a bien été inseré
```bash
{
  acknowledged: true,
  insertedId: ObjectId("63e25075e985d5219fb67846")
}
```

## Exercice 2
  
Rajoutez à vos critères de validation existants un critère supplémentaire : le champ ```id``` devra dorénavant être de type entier (int) ou ObjectId.
  
Validation 
```bash
var proprietes = {
	"_id": {
		"bsonType": ["int", "objectId"],
		"description": "int ou objectid obligatoire" 
	},
	"nom": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	},
	"capacite": {
		"bsonType": "int", 
		"description": "int obligatoire" 
	},
	"adresse.codePostal": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	},
	"adresse.ville": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	}
}

db.runCommand( { "collMod": "salles", "validator": { $jsonSchema: { "bsonType": "object", "required": ["nom", "capacite", "adresse.codePostal", "adresse.ville"], "properties": proprietes } } })



db.salles.insertOne({'nom': "Salle1", "capacite": 456, "adresse":{"codePostal":'30000', "ville":"Roanne"}})
```

https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/json-schema-tips/

Que se passe-t-il si vous tentez de mettre à jour l’ensemble des documents existants dans la collection à l’aide de la requête suivante :

```bash
db.salles.updateMany({}, {$set: {"verifie": true}})
```

	J'obtient l'erreur suivante :

```bash
Uncaught:
MongoServerError: Document failed validation
Additional information: {
  failingDocumentId: ObjectId("63e22ed43dc0a8b43bdd4414"),
  details: {
    operatorName: '$jsonSchema',
    schemaRulesNotSatisfied: [
      {
        operatorName: 'required',
        specifiedAs: {
          required: [ 'nom', 'capacite', 'adresse.codePostal', 'adresse.ville' ]
        },
        missingProperties: [ 'adresse.codePostal', 'adresse.ville' ]
      }
    ]
  }
}
```

	L'erreur signifie que au moins un de mes documents ne respecte pas le schema de validation.

## Exercice 3

Rajoutez aux critères de validation existants le critère suivant :
- Le champ smac doit être présent OU les styles musicaux doivent figurer parmi les suivants : "jazz", "soul", "funk" et "blues".

Validation :
```bash

let someVar = db.getCollectionInfos({"name" : "salles"})[0].options.validator

someVar.$or = [	{ "smac": { "$exists": true } }, { "styles": { "$exists": true } }]

db.runCommand( { "collMod": "salles", "validator": someVar} )
```

Que se passe-t-il lorsque nous exécutons la mise à jour suivante ?
 
```bash
db.salles.update({"_id": 3}, {$set: {"verifie": false}})
```

# Exercice : Index.ms

## Exercice 1

Un bref examen de vos fichiers journaux a révélé que la plupart des requêtes effectuées sur la collection salles cible des capacités ainsi que des départements, comme ceci :

``` bash
db.salles.find({"capacite": {$gt: 500}, "adresse.codePostal": /^30/})

db.salles.find({"adresse.codePostal": /^30/, "capacite": {$lte: 400}})
```

Que proposez-vous comme index qui puisse couvrir ces requêtes ?

```
db.salles.createIndex({"capacite": 1,"adresse.codePostal": 1})
```

Détruisez ensuite l’index créé.

```bash
db.salles.dropIndex('capacite_1_adresse.codePostal_1')
```

https://www.mongodb.com/docs/manual/indexes/
# Exercice : Aggregation.md

## Exercice 1

Écrivez le pipeline qui affichera dans un champ nommé ville le nom de celles abritant une salle de plus de 50 personnes ainsi qu’un booléen nommé grande qui sera positionné à la valeur « vrai » lorsque la salle dépasse une capacité de 1 000 personnes. Voici le squelette du code à utiliser dans le shell :

```bash
var pipeline = [
	{ 
		$match: {
			"capacite": {$gt: 50}
		}
	}, 
	{
		$project: {
			"_id": 0, 
			"ville": "$adresse.ville",
			"grande": { $gt: ["$capacite", 1000] }
		}
	}
]

db.salles.aggregate(pipeline)
```

## Exercice 2

Écrivez le pipeline qui affichera dans un champ nommé apres_extension la capacité d’une salle augmentée de 100 places, dans un champ nommé avant_extension sa capacité originelle, ainsi que son nom.

```bash
var pipeline = [
	{
		$project: {
			"_id": 0, 
			"nom": 1,
			"apres_extension": { $sum: ["$capacite", 100] },
			"avant_extension": "$capacite"
		}
	}
]

db.salles.aggregate(pipeline)
```

## Exercice 3

Écrivez le pipeline qui affichera, par numéro de département, la capacité totale des salles y résidant. Pour obtenir ce numéro, il vous faudra utiliser l’opérateur $substrBytes dont la syntaxe est la suivante :

```bash

{$substrBytes: [ < chaîne de caractères >, < indice de départ >,
< longueur > ]}

var pipeline = [
{
	$group: {
		"_id": {$substrBytes: ["$adresse.codePostal", 0, 2]},
		"capacite": {$sum: "$capacite"},
	}
}]
	
db.salles.aggregate(pipeline)
```

## Exercice 4

Écrivez le pipeline qui affichera, pour chaque style musical, le nombre de salles le programmant. Ces styles seront classés par ordre alphabétique.

```bash
var pipeline = [
	{
		$unwind: "$styles"
	},
	{
		$group: {
			"_id": "$styles",
			"number": {$sum: 1},
		}
	}
]
	
db.salles.aggregate(pipeline)
```

https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/

## Exercice 5

À l’aide des buckets, comptez les salles en fonction de leur capacité :
- celles de 100 à 500 places
- celles de 500 à 5000 places

``` bash
var pipeline = [
	{
		$bucket: {
			groupBy: "$capacite", 
			boundaries: [ 100, 500, 5000 ],
			default: "Other", 
			output: { 
				"count": { $sum: 1 },
				"salles" : {
					$push: {
						"nom": "$nom"
					}
				}
			}
		}
	}
]

db.salles.aggregate(pipeline)
```

https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/

## Exercice 6

Écrivez le pipeline qui affichera le nom des salles ainsi qu’un tableau nommé avis_excellents qui contiendra uniquement les avis dont la note est de 10.

```bash
var pipeline = [
	{ 
		$match: { "avis.note": {$eq: 10} }
	}, 
	{
		$project: {
			"_id": 0, 
			"nom": 1,
			"avis_excellents": {
				$filter: {
					input: "$avis",
					as: "notice",
					cond: {
						$eq : [
						"$$notice.note",
						10
						]
					}
				}
			},
		}
	}
]

db.salles.aggregate(pipeline)
```

https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/
https://www.mongodb.com/docs/manual/reference/operator/aggregation/filter/

# Exercice : Geo.md

## Exercice 1

Vous disposez du code JavaScript suivant qui comporte une fonction de conversion d’une distance exprimée en kilomètres vers des radians ainsi que d’un document dont les coordonnées serviront de centre à notre sphère de recherche. Écrivez la requête $geoWithin qui affichera le nom des salles situées dans un rayon de 60 kilomètres et qui programment du Blues et de la Soul.

```
var KilometresEnRadians = function(kilometres){
   var rayonTerrestreEnKm = 6371;
   return kilometres / rayonTerrestreEnKm;
};

var salle = db.salles.findOne({"adresse.ville": "Nîmes"});

var requete = { ... };

db.salles.find(requete ... };
```

```bash
var KilometresEnRadians = function(kilometres){
   var rayonTerrestreEnKm = 6371;
   return kilometres / rayonTerrestreEnKm;
};

var salle = db.salles.findOne({"adresse.ville": "Nîmes"});

var requete = { 
	"adresse.localisation": { 
		$geoWithin: { 
			$centerSphere: [ salle.adresse.localisation.coordinates, KilometresEnRadians(60)] 
		} 
	},
	"styles": {$in: ["blues", "soul"]}
}

db.salles.find(requete, {"_id": 0, "nom": 1});

```  

## Exercice 2:

Écrivez la requête qui permet d’obtenir la ville des salles situées dans un rayon de 100 kilomètres autour de Marseille, triées de la plus proche à la plus lointaine :

```bash
db.salles.createIndex({"adresse.localisation": "2dsphere"})

var marseille = {
	"type": "Point", 
	"coordinates": [43.300000, 5.400000]	
}

db.salles.find(
	{
		"adresse.localisation": 
		{
			$nearSphere: {
				$geometry: marseille,
				$maxDistance: 100000
			}
		}
	}, {"_id": 0, "nom": 1}
).sort({"adresse.localisation": 1})
```

## Exercice 3:

Soit polygone un objet GeoJSON de la forme suivante :
```
var polygone = {
     "type": "Polygon",
     "coordinates": [
            [
               [43.94899, 4.80908],
               [43.95292, 4.80929],
               [43.95174, 4.8056],
               [43.94899, 4.80908]
            ]
     ]
}
```

Donnez le nom des salles qui résident à l’intérieur :
```bash
db.salles.find({
	"adresse.localisation": {
		$geoWithin: { 
			$geometry: polygone
		}
	}
}, {"_id": 0, "nom": 1}
)
```