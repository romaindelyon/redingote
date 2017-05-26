'use strict';

angular.module('cartes').controller('CartesCreationConsequencesController', ['$scope',
	function($scope) {

	$scope.retirerElement = function(type,object){
		console.log(object[type])
		if (object[type].length == 1){
			object[type] = [];
		}
		else if (object[type].length == 2){
			object[type] = [1];
		}
		else if (object[type].length == 3){
			object[type] = [1,2];
		}
	}
	$scope.ajouterElement = function(type,object){
		console.log('ajouter');
		if (object[type].length == 0){
			object[type] = [1];
		}
		else if (object[type].length == 1){
			object[type] = [1,2];
		}
		else if (object[type].length == 2){
			object[type] = [1,2,3];
		}
	}


	// Options de cartes:

	var cases = [];
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Feu','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];

	$scope.consequences = {
		'Action : contrer': {
			'Annulation': [],
			'Renvoi': ['Contre le lanceur',"Contre n'importe qui"]
		},
		'Belette': {
			"Brouiller l'ordre": [],
			'Réduire nombre requis': [1,2,3,4,5,6]
		},
		'Carte': {
			'Défausse': [1,2,3,4,5,'Moitié','Toutes'],
			'Don': [1,2,3,4,5,'Moitié','Toutes'],
			'Pioche': [1,2,3,4,5,6,7],
			'Récuperation': [1,2,3],
			'Vol': [1,2,3,4,5,'Moitié','Toutes']
		},
		'Carte ouverte': {
			'Défausse': [1,2,3,4,5,'Toutes'],
			'Don': [1,2,3,4,5,'Toutes'],
			'Vol': [1,2,3,4,5,'Toutes']
		},
		'Combat': {
			'Remporter': [],
			'Voler récompense': []
		},
		'Dé': {
			'Labyrinthe': ['Doubler','Relancer'],
			'Paysage': ['Doubler','Relancer']
		},
		'Déplacement': {
			'Avantage': deplacement_avantages,
			'Case': cases,
			'Nombre de cases': [1,2,3,4,5,6,7,8,9,10],
			'Zone': zones
		},
		'Duel': {
			'Bonus attaque': [1,2,3,4,5,6,7,8,9,10,11,12],
			'Bonus défense': [1,2,3,4,5,6,7,8,9,10,11,12],
			'Bonus attaque et défense': [1,2,3,4,5,6,7,8,9,10,11,12],
			'Changement congruence (deux joueurs)': [15,18,20],
			'Changement récompense': ['Vol'],
			'Double-tranchant': [],
			'Gagner': []
		},
		'Grande carte': {
			'Pioche': [1,2,3]
		},
		'Lecture': {
			'Princesse de Clèves': []
		},
		'Mission': {
			'Pioche': [1],
			'Remplacer objet requis': [1,2,3]
		},
		'Modulation': {
			'Modulation': ['Fi mineur','La majeur','Ré mineur']
		},
		'Montée de marche': {
			'Jeu': ['Echouer','Gagner','Rejouer']
		},
		'Objet': {
			'Création': ['Photo'],
			'Transformation': []
		},
		'Protection': {
			'Cartes': [1,2,3,4,5,'Toutes'],
			'Grandes cartes': [1,2,3,4,5,'Toutes'],
			'Type': typesActions
		},
		'Tour': {
			'Inverser': [],
			'Passer': [1,2,3],
			'Rejouer': [1,2,3]
		},
		'Trois familles': {
			'Remplacer membre requis': [1,2,3,4,5]
		}
	};

}]);