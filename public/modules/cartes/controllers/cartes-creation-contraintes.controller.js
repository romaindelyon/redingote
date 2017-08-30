'use strict';

angular.module('cartes').controller('CartesCreationContraintesController', ['$scope',
	function($scope) {

	$scope.objets = [
		{types:[],
		consequences: [1],
		contraintes: [],
		moments: [1],
		pouvoirs: [1]},
		{types:[],
		consequences: [1],
		contraintes: [],
		moments: [1],
		pouvoirs: [1]}
	];
	console.log("in controller")
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

	var cases = [];
	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	var typesObjets = ['Animal','Chat','Combustible','Electrique','Insecte','Marin','Métallique','Potion bénéfique','Potion malefique','Toxique'];
	var typesActions = ['Combustible','Faim','Insecte','Nuit','Soif','Toxique'];
	var typesHumeurs = ['Négative','Russe','Triste'];
	var deplacement_avantages = ["Crapauduc","Respiration sous l'eau","Vitesse doublée"];

	$scope.contraintes = {
		'Carte': {
			'Spécifique': []
		},
		'Carte ouverte': {
			'Chez le lanceur': [],
			"Chez n'importe qui": []
		},
		'Joueur': {
			'Adversaire': ['Julia','Marie','Romain']
		},
		'Position': {
			'Case': [],
			'Plateau': ['Escalier','Labyrinthe','Paysage'],
			'Zone': zones
		},
		"Type de carte": {
			"Action": typesActions,
			"Humeur": typesHumeurs,
			"Objet": typesObjets
		}
	};

}]);