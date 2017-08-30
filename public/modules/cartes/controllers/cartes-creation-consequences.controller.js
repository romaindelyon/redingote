'use strict';

angular.module('cartes').controller('CartesCreationConsequencesController', ['$scope','$http','Cartes',
	function($scope,$http,Cartes) {

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
		object.info[type].splice(object[type].length-1,1);
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
	$scope.cases = [];
	$http({
        method: 'GET', 
        url: 'modules/plateaux/json/plateaux-paysage.json'
    }).success(function(response){
    	for (var i in response){
    		for (var j in response[i].colonnes){
    			if ($scope.cases.indexOf(response[i].colonnes[j].numero) < 0){
    				$scope.cases.push(response[i].colonnes[j].numero);
    			}
    		}
    	}
    });
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Feu','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée","Nage","Survoler","Hubs sans documents","Couleurs de couronnes",'Traverser murs',"Choisir direction","Ubiquité"];

	var cartesHorsPiocheCodes = [];
	var cartesHorsPiocheNoms = [];
	Cartes.getCartes({partieId: 1}).success(function(response){
		for (var i in response){
			// agreger cartes par code:
			if (response[i].pile === 'hors_pioche' && response[i].categorie === 'objet' && cartesHorsPiocheCodes.indexOf(response[i].code < 0)){
				cartesHorsPiocheCodes.push(response[i].code);
				cartesHorsPiocheNoms.push(response[i].nom);
			}
		}
	});

	$scope.consequences = {
		'Action : contrer': {
			'Annulation': [],
			'Renvoi': ['Contre le lanceur',"Contre n'importe qui"]
		},
		'Animaux ouverts': {
			'Utiliser autres joueurs': []
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
			'Vol': [1,2,3,4,5,'Moitié','Toutes'],
		},
		'Carte ouverte': {
			'Défausse': [1,2,3,4,5,'Toutes'],
			'Don': [1,2,3,4,5,'Toutes'],
			'Vol': [1,2,3,4,5,'Toutes']
		},
		'Combat': {
			'Prédire victoire voler récompense': [],
			'Remporter': [],
			'Voler récompense': []
		},
		'Dé': {
			'Labyrinthe': ['Doubler','Relancer'],
			'Paysage': ['Doubler','Relancer']
		},
		'Déplacement': {
			'Avantage': deplacement_avantages,
			'Case': $scope.cases,
			'Téléportation': ['Vers un joueur','Cases 62'],
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
		'Joueur': {
			'Pas de préjudice': []
		},
		'Lecture': {
			'Princesse de Clèves': []
		},
		'Mission': {
			'Pioche': [1],
			'Plusieurs missions': [2,3],
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
		'Objet Hors Pioche': {
			'Pioche': typesObjets
		},
		'Question': {
			'Répondre': []
		},
		'Protection': {
			'Cartes': [1,2,3,4,5,'Toutes'],
			'Grandes cartes': [1,2,3,4,5,'Toutes'],
			'Type': typesActions
		},
		'Tour': {
			'Inverser': [],
			'Passer': [1,2,3],
			'Rejouer': [1,2,3],
			'Doubler étape': []
		},
		'Trois familles': {
			'Remplacer membre requis': [1,2,3,4,5]
		},
		'Vision': {
			'Messages': [],
			'Main': [],
			'Cartes piochées': []
		}
	};

}]);