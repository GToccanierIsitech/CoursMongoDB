Exercice 1

Écrivez le pipeline qui affichera dans un champ nommé ville le nom de celles abritant une salle de plus de 50 personnes ainsi qu’un booléen nommé grande qui sera positionné à la valeur « vrai » lorsque la salle dépasse une capacité de 1 000 personnes. Voici le squelette du code à utiliser dans le shell :
```
var pipeline = [ 
... 
] 
```
 
db.salles.aggregate(pipeline) 
Exercice 2

Écrivez le pipeline qui affichera dans un champ nommé apres_extension la capacité d’une salle augmentée de 100 places, dans un champ nommé avant_extension sa capacité originelle, ainsi que son nom.

Exercice 3

Écrivez le pipeline qui affichera, par numéro de département, la capacité totale des salles y résidant. Pour obtenir ce numéro, il vous faudra utiliser l’opérateur $substrBytes dont la syntaxe est la suivante :
```
{$substrBytes: [ < chaîne de caractères >, < indice de départ >, 
< longueur > ]} 
```
Exercice 4

Écrivez le pipeline qui affichera, pour chaque style musical, le nombre de salles le programmant. Ces styles seront classés par ordre alphabétique.

Exercice 5

À l’aide des buckets, comptez les salles en fonction de leur capacité :

celles de 100 à 500 places

celles de 500 à 5000 places

Exercice 6

Écrivez le pipeline qui affichera le nom des salles ainsi qu’un tableau nommé avis_excellents qui contiendra uniquement les avis dont la note est de 10.