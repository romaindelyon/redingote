'use strict';

angular.module('cartes').controller('CartesCreationMissionController', ['$scope','Cartes',
	function($scope,Cartes) {

	$scope.retirerElement = function(type,object){
		console.log(object[type])
		object[type].splice(object[type].indexOf(object[type].length),1);
	}
	$scope.ajouterElement = function(type,object){
		console.log(object);
		object[type].push(object[type].length + 1);
		console.log(object[type]);
	}
	$scope.ajouterCarte = function(index){
		console.log(index);
		$scope.carte.info.etapes[index].cartes.push($scope.carte.info.etapes[index].cartes.length + 1);
	}
	$scope.retirerCarte = function(index){
		$scope.carte.info.etapes[index].cartes.splice($scope.carte.info.etapes[index].cartes.length-1,1);
	}
	$scope.ajouterCase = function(index){
		console.log(index);
		$scope.carte.info.etapes[index].cases.push({});
	}
	$scope.retirerCase = function(index){
		$scope.carte.info.etapes[index].cases.splice($scope.carte.info.etapes[index].cases.length-1,1);
	}
	$scope.retirerEtape = function(){
		$scope.carte.info.etapes.splice($scope.carte.info.etapes.length-1,1);
	}
	$scope.ajouterEtape = function(){
		$scope.carte.info.etapes.push({
			cartes: [1],
			cases: [{}]
		});
		console.log($scope.carte.info)
	}

	var cartesCodes = [];
	$scope.cartesNoms = [];
	Cartes.getCartes({partieId: 1}).success(function(response){
		for (var i in response){
			// agreger cartes par code:
			if (response[i].pile === 'pioche' || response[i].pile === 'hors_pioche' && cartesCodes.indexOf(response[i].code < 0)){
				cartesCodes.push(response[i].code);
				$scope.cartesNoms.push(response[i].nom);
			}
		}
	});

	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	//$scope.plateaux = ['Labyrinthe','Paysage'];
	
	$scope.missions = {
		'Apporter des cartes': {
			'Cartes': [1],
			'Case': $scope.cases
		},
		'Réunir des cartes': {
			'Cartes': [1]
		},
		'Remporter des duels': {
			'Joueurs': []
		},
		'Visiter des cases': {
			'Cases': $scope.cases
		},
		'Visiter des zones': {
			'Zones': $scope.zones
		}
	};

}]);