'use strict';

angular.module('jeu').controller('JeuMainController', ['$scope','$timeout','Cartes','ConfrontationsAttaqueService',
	function($scope,$timeout,Cartes,ConfrontationsAttaqueService) {

	// Mains:

	$scope.focusIndex = -2;

	$scope.focusCarte = function(index){
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
		}
		else {
			$scope.focusIndex = index;
		}	
	}

	$scope.utiliserCarte = function(index){
		var carte = $scope.jeu.main[index];
		if (carte.categorie == 'action'){
			$scope.$emit('confrontations-attaque-action-start', {carte: carte,carteIndex: index});
			console.log('event emitted');
		}
	}

	$scope.ouvrirCarte = function(index){
		var carte = $scope.jeu.main[index];
		carte.main.ouverte = true;
		Cartes.changementMain({
    		carteId: $scope.jeu.main[index].id,
    		main: carte.main
    	}).success(function(){
			$timeout(function(){
				$scope.jeu.ouvertes.push(carte);
			},250);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.main[index].id],
    		position: -2
    	}).success(function(){
    		var carte = $scope.jeu.main[index];
    		carte.main = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.main.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.jeterAttaqueCarte = function(index){
		$scope.$emit('confrontations-defense-jeter-carte', {index: index});
	}

}]);