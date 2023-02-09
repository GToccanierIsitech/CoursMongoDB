
Une **collection** est un groupe de documents MongoDB. C'est l'équivalent d'une table dans une système de gestion de base de données. Les collections n'imposent pas de schéma précis.

Les **documents** présents au sein d'une même collection peuvent avoir des champs différents.

Malgré cela, tous les documents d'une même collection sont généralement similaires ou ont un usage similaire.

Ceci est un objet vide en JSON :
```json
{}
```

Les proprietés d'un objet JSON sont materialisees par une ou plusieurs paires clé/valeur :
```Json
{ 
	"clé": "valeur",
	"une_autre_clé": "une_autre_valeur",
	"un_objet" : {
		"cle1": "value1",
		"clé2": "value2"
	},
	"un_tableau": [""]
}
```

JSON prend en charge de facon native plusieurs types de données :
- **booleen**
- **numérique**
- **chaine de caractère**
- **tableau**
- **objet**
- **null** (indique une absence de valeur)

MongoDB vient ajouter des types :
- le type **Date**: stocke sous la forme d'un entier signe de 8 octets
- le type **ObjectID**: stocke 12 octets, utilise en interne par Mongo afin de générer des identifiants
- Le type **NumberLong** et **NumberInt** par défault, MongoDB considere toute valeur numérique comme un nombre a virgule codé sur 8 octets, Représentent des entiers signés sur 8 et 4 octets.
- Le type **BinData**: pour stocker des chaines de caractere s ne possedant pas de représentation dans l'encodage UTF-8, ou n'importe quel contenu binaire


Pour lancer le serveur :
```bash
mongod

mongod --port 27017 --dbpath /data/databases --logpath /tmp/mongodb.log --logappend
```



### Création d'une base de données :

```bash
use {nom_de_la_bdd}

db.{nom_de_la_collection}.insertOne({
	'une_cle':'une_valeur'
})
```


### Supprimer une base de données :

```bash
use {nom_de_la_bdd}

db.dropDatabase()
```


### Manipulation des données :

##### Récupérer les informations de la collection

```bash
db.{nom_de_la_collection}.find()

db.{nom_de_la_collection}.find().pretty()

db.{nom_de_la_collection}.find(<filter>, <projection>)

Exemple:
db.{nom_de_la_collection}.find({"age": {$eq: 76}})
db.{nom_de_la_collection}.find({"age": 76}, {"_id": false, "prenom": false})

db.maCollection.find({"age" : { $lt: 50, $gt: 20 }}) 
db.maCollection.find({"age" : { $nin: [231, 45, 78] }})
db.maCollection.find({"age": { $exists: true }})

```

##### Inserer des documents

```bash
db.{nom_de_la_collection}.insertOne(<document>)
db.{nom_de_la_collection}.insertMany(<documents>)

---------------------------------------------------------------------------------------------

var athletes = [{ "nom": "Eclair","prenom": "Jean-Michel", "discipline": "Course"}, {"nom":"Cavalera", "prenom": "Max","discipline": "Saut de haies"}, {"nom": "Hammer", "prenom": "Hemsi"}]

db.{nom_de_la_collection}.insertMany(athletes)
```

##### Mettre a jour des document

```bash
db.{nom_de_la_collection}.updateOne(<filtre>, <modifications>)

exemple 
(db.{nom_de_la_collection}.updateOne({"key" : "id"} ,{ $set: {"key" : "id_update"}}))
```

##### Mettre a jour avec upsert

```bash
db.{nom_de_la_collection}.updateOne(<filtre>, <modifications>, {"upsert": true})
```

##### Validation des documents

```bash
var proprietes = {
	"nom": {
		"bsonType": "string", 
		"pattern": "^[A-Z].",
		"description": "Chaîne de caractères+ expr régulière - obligatoire" 
	},
	"prenom": {
		"bsonType": "string", 
		"description": "Chaîne de caractères obligatoire" 
	},
	"discipline":{
		"enum": ["Course", "Lancer de marteau", "Saut de haies"],
		"description": "Enumération - obligatoire" 
	}
}

db.runCommand(
	{
		"collMod": "athletes", 
		"validator": {
			$jsonSchema: {
				"bsonType": "object",
				"required": ["nom", "prenom", "discipline"],
				"properties": proprietes
			}
		}
	}
)
```

##### Supprimer des documents
```bash

```

### RunCommand :

```bash
db.runCommand({"collstats":"{nom_de_la_collection}"})
```

### Les collations :

```bash
{
	locale: <string>,
	caseLevel: <boolean>,
	caseFirst: <string>,
	strength: <entier>,
	numericOrdering: <boolean>,
	...
}
```

Au sein de ce document le champ locale est obligatoire

### Creer une collection :

```Bash
db.createCollection("{nom_de_la_nouvelle_collection}",{"collation":{"locale" : "fr"}})
```

### Propriétés :
```bash
DBQuery.shellBatchSize = 40
```

### Opérateur :

##### Basique

```bash
- $ne: different de
- $gt: superieur a, 
- $gte: superieur ou egal
- $lt: inferieur a,
- $lte: inferieur ou égal
- $in et $nin : absence ou presence
```

##### Expr

```bash
- $expr
```

Il permet d'utiliser des expression dans nos requêtes. Ces expressions pourront contenur des operateurs, des objets ou encore des chemins d'objers pointant vers des champs.

Exemple : 
- On va chercher a afficher les documents dont la longueur du nom multipliee par 12 est supérieur a l'age

```bash
db.personnes.find({
	"nom": {$exists:1},
	"age": {$exists:1},
	$expr: { $gt: [ { $multiply: [ { $strLenCP: "$nom" }, 12 ] }, "$age"] }
})
```

- Afficher les comptes dont la sommes des oprération de debit est superieure au montant du credit

```bash
db.banque.find({ $expr: { $gt: [{ $sum: "$debit" }, "$credit"] }})
```

##### Type

Signature:
```js
{champ: {$type: <type BSON>}}
```

```bash
db.personnes.find({'age': {$type: 'int'}})
```

##### Where

```bash
db.personnes.find({$where: "this.nom.length > 6"})

db.personnes.find({$where: function(){
	return this.nom.length > 6
}})
```

##### Opérateur de tableau

```bash
{ $push: {<champ>:<valeur>, ... } }
```

```bash
db.hobbies.updateOne({"_id": {$eq : 1}} ,{ $push: {"passions": "Tekken"}})
# Ajouter la passion parachute a line (_id = 3)
db.hobbies.updateOne({"_id": {$eq : 3}} ,{ $push: {"passions": "Parachute"}})
# Retirer la passion parachute a line (_id = 3)
db.hobbies.updateOne({"_id": {$eq : 3}} ,{ $pull: {"passions": "Parachute"}})
```

##### AddToSet



##### All

```bash
# Pour trouvé toute les personnes qui ont l'interet bridge et jardinage
db.personnes.find({"interets": {$all: ["bridge", "jardinage"]}})
# Pour trouvé toute les personnes qui ont l'interet jardinage en 2eme position
db.personnes.find({"interets.1": "jardinage"})
```

##### Size

```bash
# Pour trouvé les tableau interet égale a 2
db.personnes.find({"interets": {$size: 2}})
# Pour trouvé les tableau interet qui on au moins 2 hobbie
db.personnes.find({"interets.1": {$exists: 1}})
```

##### elemMatch

```bash
# Pour trouvé toutes les personnes qui ont des notes entre 0 et 10
db.eleves.find({"notes" : {$elemMatch: {$gt: 0, $lt: 10}}})
# Pour trouvé toutes les personnes qui ont 5 et 7.5 dans les notes
db.eleves.find({"notes" : {$all: [5, 7.50]}})
```

##### nearSphere

```bash
{
	$nearSphere: {
		$geometry: {
			type: "Point",
			coordinates: [<longitude>, <latitude>]
		}, 
		$minDistance: <distance en metres>, 
		$maxDistance: <distance en metres>
	}
}

{
	$nearSphere: [ <x>, <y> ], 
	$minDistance: <distance en radians>,
	$maxDistance: <distance en radians>
}
```

Exemple : 
```bash
let Opera_Avignon = {
	"type": "Point",
	"coordinates": [43.949746, 4.805606]
}

db.avignon.find(
	{
		"localisation": {
			$nearSphere: {
				$geometry: Opera_Avignon
			}
		}
	}, {"_id": 0, "nom": 1}
)
```

##### geoWithin

Sa permet de capturer les document donc les donnees geospacial sont a l'interieur du polygon défini

```bash
var polygone = [
	[43.9548, 4.80143],
	[43.95475, 4.80779],
	[43.95045, 4.81097],
	[43.4657, 4.80449]
]

db.avignon2d.find(
	{
		"localisation": {
			$geoWithin: { 
				$polygon: polygone
				}
		}
	}
)

var polygone = [
	[43.9548, 4.80143],
	[43.95475, 4.80779],
	[43.95045, 4.81097],
	[43.947, 4.80449],
	[43.9548, 4.80143]
]

db.avignon.find({
	"localisation": {
		$geoWithin: { 
			$geometry: {
				type: "Polygon",
				coordinates: [polygone]
			}
		}
	}
}, {"_id": 0, "nom": 1}
)
```

##### group
```bash
{  
	$group: {     
		_id: <expression>, 
		<field1>: { <accumulator1> : <expression1> }, 
	} 
}
```

operateur d'accumulation: `$push`, `$sum`, `$avg`, `$min`, `$max`

```bash
var pipeline = [{
	$group: {
		"_id": "$age",
		"nombre_personnes": {$sum: 1}
	}
}, 
{
	$sort: {
		"nombre_personne" : 1
	}
}]
# ou
var pipeline= [{
	$group: {
		"_id": null,
		"nombre_personnes": {$sum: 1}
	}
}]

bd.personnes.aggregate(pipeline)
```

```bash
var pipeline = [
	{
		$match: {
			"age": {$exists: true}
		}
	},
	{
		$group: {
			"_id": null,
			"avg": {
				$avg: "$age"
			}
		}
	},
	{
		$project: {
			"_id": 0,
			"Age_moyen": {
				$ceil: "$avg"
			}
		}
	}
]
```

##### sortByCount

```bash
bd.personnes.aggregate({
	{
		$sortByCount: "$age"
	}
})
```

### Les tableaux de documents

```bash
# Afficher les eleves qui ont eu un 10
db.eleves.find({"notes.note": 10})
```

Renvoyer les documents dont les eleves ont au moins une note entre 10 et 18 dans une matiere quelconque :
```bash
db.eleves.find({"notes": {$elemMatch: { "note": { $gt: 10, $lte: 15 }}}})
# OU
db.eleves.find({ $and: [ {"notes.note": { $gt: 10 }}, {"notes.note": { $lte: 15 }} ]})

# Et pas
db.eleves.find({"notes.note": { $gt: 10, $lte: 15 }})
```

```bash
db.eleves.find({"notes.0.note": {$lt: 10}})
```

### Trier les résultats

```bash
{requete}.sort(<tri>)

#exemple
db.eleves.find().sort({"salary":-1})
```

```bash
{requete}.limit({number})

#exemple
db.eleves.find().limit(5)
```

### Les index :
{elasticsearch et algolia}

La nature de votre application devra impacter votre logique d'undexation : est-elle orientee ecriture {write-heavy} ? ou lecture  {read-heavy} ?

##### Créer un index
```bash
db.collection.createIndex(<champ + type>, <options?>)

#exemple
db.personnes.createIndex({"age": -1})

db.personnes.createIndex({"age": -1,"name": "index_age", "background": true, "collation": { "locale": "fr" })
```

Le "-1" repésente l'ordre d'apparision de l'index dans le champs

##### Voir les index
```bash
db.personnes.getIndexes()
```

##### Supprimer un index

```bash
db.personnes.dropIndex("age_-1")
```

##### Index Composé

Un index peut porter sur plusiurs champ : c'est ce que l'on appelle un index composé
```bash
db.personnes.createIndex({"age": -1,"name": 1})
```

Affiche un tableau qui contient des documents avec les informations des indexs

##### Index Geo

MongoDB permet l'utilisation de deux types d'index qui permettent de gerer les requetes géospatiales :
- Les index se type `2dsphere` sont utilisées par des requetes géospatiales intervenant sur une surface spherique
- Les index `2d` concernant des requetes intervenant sur un plan Euclidien

Pour un champ nommé `donneesSpatiales` d'une collection `cartographie` vous pouvez par exemple creer un index de type `2d` avec la commande :
```bash
db.cartographie.createIndex({"donneesSpatiales": "2d"})
```

Pour la création d'un index `2dsphere` on utilisera plutot :
```bash
db.cartographie.createIndex({"donneesSpatiales": "2dsphere"})
```

Les index 2d font intervenir des coordonnes de type `legacy` 

```bash
db.plan.insertOne({ "nom": "firstPoint", "geodata": [1,1] })

db.plan.insertOne({ "nom": "firstPoint_bis", "geodata": [4.7, 44.5] })

db.plan.insertOne({ "nom": "firstPoint_bis", "geodata": { "lon": 4.7, "lat": 44.5} })
```

### Les objects GeoJSON :

```
{ type: <type d'objet>, coordinates: <coordinnees> }
```

##### Le type point

```
{
	"type": "Point",
	"coordinates": [14.0, 1.0]
}
```

Test : 
##### Le type MultiPoint
``
```
{
	"type": "MultiPoint",
	"coordinates": [
		[13.0, 1.0], [13.0, 3.0], [14.0, 1.0]
	]
}
```

##### Le type LineString
``
```
{
	"type": "LineString",
	"coordinates": [
		[13.0, 1.0], [13.0, 3.0]
	]
}
```

##### Le type Polygon

```bash
{
	"type": "Polygon",
	"coordinates": [
		[
			[13.0, 1.0], [13.0, 3.0]
		],
		[
			[13.0, 1.0], [13.0, 3.0]
		]
	]
}
```

### Framework d'aggregation :

```
db.collection.aggregate(pipeline, options)
```
- pipeline: designe un tableau d'étapes
- options: designe un document

##### match

```bash
var pipeline = [{$match: {"interets": "jardinage"}}]
db.personnes.aggregate(pipeline)

var pipeline = [{$match:  {"interets": "jardinage"}, $match: {"nom": /^L/ , "age": {$gt: 70}}}]
db.personnes.aggregate(pipeline)

```

##### project

```bash
# Variable 
var pipeline = [
	{ 
		$match: {
			"interets": "jardinage"
		}
	}, 
	{
		$project: {
			"_id": 0, 
			"nom": 1,
			"prenom": 1, 
			"ville": "$adresse.ville"
		}
	},
	{
		$match: {
			"ville": { $exists: true }
		}
	}
]

# Autre Variable 
var pipeline = [ { $match: { "interets": "jardinage" } }, { $project: { "_id": 0, "nom": 1, "prenom": 1, "super_senior": { $gte: ["$age", 70] } } }, { $match: { "super_senior": true } }] 

# Pour finir
db.personnes.aggregate(pipeline)

```

##### addFields

```bash
{ $addFields: { <newField>: <expression>, ... } }
```

```bash
db.personnes.aggregate([
{
	$addFields : {
		"numero_secu_s": ""
	}
}
])
```

# Exercice du cours :

##### Créer une collection et la renomé

Création d'une collection appelée "test" et on la renome "test2".
```bash
db.createCollection("test",{"collation":{"locale" : "fr"}})
db.test.renameCollection("test2")
```
https://www.mongodb.com/docs/manual/reference/method/db.collection.renameCollection/

##### Effectuer des recherches sur findAndModify

`findAndModify()`, est utilisé pour trouver et modifier un document spécifique dans une collection. Cette méthode trouve le premier document correspondant à un critère donné, retourn ce document et le modifie en fonction des options spécifiées.

Si on veux que le document retourné soit le nouveau document avec la modification

Exemple :
```bash
db.personnes.findAndModify( { 
	query: { 
		nom: "Dupont" 
	}, 
	update: { 
		$inc: { "age": 1 } 
	},
	new: true
})
```
Return :
```bash
{
  _id: ObjectId("63e37e0839f9b8622ea11ee6"),
  nom: 'Dupont',
  prenom: 'Catherine',
  interets: [ 'cuisine', 'jardinage' ],
  age: 67,
  adresse: { cp: 13480, ville: 'Calas' }
}
```

https://www.mongodb.com/docs/manual/reference/method/db.collection.findAndModify/


##### Essayer de lever une erreur qui permet de vérifier que les schemas de validation appliquer fonctionnent

```bash
test_cours> db.athletes.insertOne({ "nom": "Toccanier", "prenom": "Gregory", "discipline": "developpement"})

Uncaught:
MongoServerError: Document failed validation 
Additional information: {
	failingDocumentId: ObjectId("63e1047f4ba0d315a98ee703") 
	details: {
		operatorName:'$jsonSchema',
		schemaRulesNotSatisfied: [
			{
			operatorName:'properties',
			propertiesNotSatisfied: [
				propertyName: 'discipline',
				description: 'Enumération - obligatoire', 
				details: [ [Object] ]
			}
		}
	}
}
```

##### Comment fonctionne le code suivant qui permet d'arrondir des chiffres 

Pour arrondir les chiffre 2 chiffre après la virgule, le code suivant :
- Multiplie par 100 le nombre ciblé 
- Soustrait la partie decimal de ce nombre a lui même
- Divise par 100 le resultat 

Exemple avec 3,1415926 :

	Etape 1 : 3,1415926 * 100 = 314,15926
	Etape 2 : 314,15926 - 0,15926 = 314
	Etape 3 : 314 / 100 = 3,14
 
``` bash
db.achats.aggregate([
	{     
		$addFields: {         
			"total_achats": { 
				$sum: "$achats" 
			},         
			"total_reduc": { 
				$sum: "$reductions" 
			}
		}
	},
	{     
		$addFields: {
			"total_final": { 
				$subtract: [ "$total_achats",  "$total_reduc" ] 
			}      
		}  
	},  
	{     
		$project: {         
			"_id": 0,         
			"nom": 1,         
			"prenom": 1,         
			"Total payé": { 
				$divide:[{ 
					$subtract: [
						{ $multiply: ['$total_final', 100] },                
						{ $mod: [{ $multiply: ['$total_final', 100] }, 1] }
					]
				}, 100]
			}
		}
	}
])

[
  { nom: 'Pascal', prenom: 'Léo', 'Total payé': 258.35 },
  { nom: 'Perez', prenom: 'Alex', 'Total payé': 305.58 }
]
```

