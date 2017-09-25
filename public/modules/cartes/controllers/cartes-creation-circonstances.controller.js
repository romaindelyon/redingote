'use strict';

angular.module('cartes').controller('CartesCreationCirconstancesController', ['$scope',
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
		object.info[type].splice(object[type].length-1,1);
		console.log(object);
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
	var typesActions = ['Combustible','Faim','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];


	$scope.circonstances = {
		'Action de case': [],
		'Action': {
			'Défense': []
		},
		"Changement d'humeur": [],
		'Défausse': [],
		'Début de tour': [],
		'Déplacement': {
			'Paysage': [],
			'Labyrinthe': []
		},
		'Duel': {
			'Attaque': [],
			'Défense': []
		},
		'Dé': {
			'Paysage': [2,3,4,5,7,12,16,73],
			'Rhomboédrique': [0,1,2]
		},
		'Echange': [],
		'Interlude musical': [],
		'Mission': {
			'Pioche': [],
			'Réussie': []
		},
		'Montée de marche': {
			'Tentative': [],
			'Réussie': [],
			'Echouée': []
		},
		'Question': {
			'Posée': [],
			'Répondue correctement': [],
			'Répondue faussement': []
		},
		'Trois familles': [],
		"Utilisation d'objet": [],
		'Valise non matérialisée': []
	};

}]);