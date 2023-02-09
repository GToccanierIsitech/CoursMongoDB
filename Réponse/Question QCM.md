1. ✘ Comment spécifiez-vous un filtre pour les documents renvoyés par la méthode find() (1 point)
```
En passant un argument de requête au méthode find()
```

2. ✓  Comment MongoDB stocke les données sur le disque ? (1 point)
```
En utilisant une architecture de fichier BSON (Binary JSON)
```

https://www.digitalocean.com/community/tutorials/how-to-back-up-restore-and-migrate-a-mongodb-database-on-ubuntu-20-04-fr

3. ✓ Quelle est la requête MongoDB correspondante à la sélection de tous les documents triés par ordre décroissant du champ age ? (1 point)
```
db.collection.find().sort({age: -1})
```

4. ✓ Que renvoie la commande suivante dans MongoDB ?  db.collection.findOne({age: {$gt: 30}}) (1 point)
```
Un seul document qui a un âge supérieur à 30
```

5. ✓ Quelle est la requête MongoDB correspondante à la sélection des documents qui ont un champ age égal à 30 ou 35 ? (1 point)
```
db.collection.find({$or: [{age: 30}, {age: 35}]}) 
```

6. ✓ Pour quel type de géométrie l'opérateur $geoWithin est-il utilisé ? (1 point)
```
Polygone
```

7. ✓ Quelle est la requête MongoDB correspondante à la sélection des documents qui ont une valeur égale à 30 pour le champ age ? (1 point)
```
db.collection.find({age: {$eq: 30}})
```

8. ✓ Quel est l'objectif de l'opérateur $nearSphere ? (1 point)
```
Chercher les documents qui se trouvent à une distance donnée d'un point.
```

9. ✓ Quelle est la requête MongoDB correspondante à la sélection des documents qui ont une valeur "red" ou "blue" dans le champ colors ? (1 point)
```
db.collection.find({interets: {$in: ["red", "blue"]}})
```

10. Expliquez brièvement l'utilité du pipeline d'aggregation.
```
Un pipeline d'agrégation est très utile lorsque l'on a plusieurs traitements à effectuer un par un dans une requête et qu'on a besoin des résultats de la première étape pour faire les autres.
```

11. ✓ Quelle est la requête MongoDB correspondante pour trouver les documents dans une zone de rayon de 2 km autour de la position [50, 50] ? (1 point)
```
db.collection.find({location: {$geoWithin: {$centerSphere: [[50, 50], 2/6378.1]}}})
```

12. ✓ Quelle est la requête MongoDB correspondante pour trouver les documents dans un polygone défini par les points [30, 10], [10, 20] et [20, 40] ? (1 point)
```
db.collection.find({location: {$geoWithin: {$polygon: [[30, 10], [10, 20], [20, 40]]}}})
```

13. ✓ Qu'est-ce qu'une collection MongoDB ? (1 point)
```
Un groupe de documents stockés en tant que tableaux
```

14. Discutez de l'utilité des indexes au sein d'une base de données mongoDB
```
Plus une collection MongoDB contient de document, plus les indexs deviens important, mettre des indexs sur les champs les plus recherché par les utilisateurs d'un site web peut faire gagner du temps a chaque requête émise depuis celui-ci et ainsi améliorer l'expérience utilisateur tout en économisant la puissance de calcul du serveur.
```

15. ✓ Quelle est la commande pour créer un index sur le champ age dans MongoDB ? (1 point)
```
db.collection.createIndex({age: 1})
```

11 / 13