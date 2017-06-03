'use strict';

angular.module('cartes').controller('CartesCreationMissionController', ['$scope','$http','Cartes',
	function($scope,$http,Cartes) {

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
	$scope.retirerEtape = function(){
		$scope.carte.info.etapes.splice($scope.carte.info.etapes.length-1,1);
	}
	$scope.ajouterEtape = function(){
		$scope.carte.info.etapes.push({
			cartes: [1],
			cases: [1]
		});
	}

	var cartesCodes = [];
	$scope.cartesNoms = [];
	Cartes.getCartes().success(function(response){
		for (var i in response){
			// agreger cartes par code:
			if (response[i].pile === 'pioche' || response[i].pile === 'hors_pioche' && cartesCodes.indexOf(response[i].code < 0)){
				cartesCodes.push(response[i].code);
				$scope.cartesNoms.push(response[i].nom);
			}
		}
	});


	var cases = [];
	$http({
        method: 'GET', 
        url: 'modules/plateaux/json/plateaux-paysage.json'
    }).success(function(response){
    	for (var i in response){
    		for (var j in response[i].colonnes){
    			if (cases.indexOf(response[i].colonnes[j].numero) < 0){
    				cases.push(response[i].colonnes[j].numero);
    			}
    		}
    	}
    });

	var zones = ['Désert','Forêt','Mer','Marécages','Monde onirique','Montagne','Prairie','Royaume des ténèbres','Village','Ville','Zone industrielle'];
	console.log($scope.cartes);
	$scope.missions = {
		'Apporter des cartes': {
			'Cartes': [1],
			'Case': cases
		},
		'Réunir des cartes': {
			'Cartes': [1]
		},
		'Remporter des duels': {
			'Joueurs': []
		},
		'Visiter des cases': {
			'Cases': cases
		},
		'Visiter des zones': {
			'Zones': zones
		}
	};

}]);