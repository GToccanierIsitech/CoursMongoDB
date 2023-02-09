#### Jeu de donnees: 
Telechargez ou generez un jeu de donnees de stations meteorologiques, qui incluent la date, la temperature, la pression atmospherique, etc.

Dataset ( Meteorological measurements / Poland / 2019-20 ): https://www.kaggle.com/datasets/krystianadammolenda/meteorological-measurements-poland-201920?resource=download

#### Preparation des donnees:
    a. Importez les donnees de stations meteorologiques dans MongoDB en utilisant la commande mongoimport.

```bash
mongoimport --db weather --collection meteorological --type csv --headerline --file meteorological_data.csv
```

    b. Assurez-vous que les donnees sont bien structurees et propres pour une utilisation ulterieure.



#### Indexation avec MongoDB:
    a. Creez un index sur le champ de la date pour ameliorer les performances de la recherche. Utilisez la methode createIndex ().
    b. Verifiez que l'index a ete cree en utilisant la methode listIndexes ().



#### Requetes MongoDB:
    a. Recherchez les stations meteorologiques qui ont enregistre une temperature superieure a 25°C pendant les mois d'ete (juin a aout). Utilisez la methode find () et les operateurs de comparaison pour trouver les documents qui correspondent a vos criteres.
    b. Triez les stations meteorologiques par pression atmospherique, du plus eleve au plus bas. Utilisez la methode sort () pour trier les resultats.



#### Framework d'agregation:
    a. Calculez la temperature moyenne par station meteorologique pour chaque mois de l'annee. Utilisez le framework d'agregation de MongoDB pour effectuer des calculs sur les donnees et grouper les donnees par mois.
    b. Trouvez la station meteorologique qui a enregistre la plus haute temperature en ete. Utilisez le framework d'agregation de MongoDB pour effectuer des calculs sur les donnees et trouver la valeur maximale.



#### Export de la base de donnees:
    a. Exportez les resultats des requetes dans un fichier CSV pour un usage ulterieur. Utilisez la commande mongoexport pour exporter des donnees de MongoDB.


