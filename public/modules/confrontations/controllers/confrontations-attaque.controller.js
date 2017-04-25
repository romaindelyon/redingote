'use strict';

angular.module('confrontations').controller('ConfrontationsAttaqueController', ['$scope','Cartes','Confrontations',
	function($scope,Cartes,Confrontations) {

	$scope.chooseJoueur = function(id){
		$scope.attaque.cible = id;
	}

	$scope.cancelAttaque = function(){
		$scope.attaque.active = false;
		$scope.attaque.cible = -1;
		$scope.attaque.carte = {};
		$scope.attaque.carteIndex = -1;
	}

	$scope.lanceAction = function(){
		var carte = $scope.attaque.carte;
		console.log(carte);
		// retirer la carte de la main:
		Cartes.moveCartes({
    		carteIds: [carte.id],
    		position: -2
        }).success(function(){
        	// send attaque !
        	Confrontations.add({
        		categorie: 'attaque',
        		type: 'action',
        		carte: carte.id,
        		cible: $scope.attaque.cible,
        		source: $scope.joueurId
        	});
    		$scope.defausses.pioche.push(carte);
			$scope.jeu.main.splice($scope.attaque.carteIndex,1);
			console.log($scope.jeu.main);
			$scope.cancelAttaque();
    	}).error(function(){

    	})
	}

}]);