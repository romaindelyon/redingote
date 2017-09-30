'use strict';

angular.module('jeu').controller('JeuHorsPiocheController', ['$scope','$rootScope','$timeout','Cartes',
	function($scope,$rootScope,$timeout,Cartes) {

	$scope.focusIndex = -2;
	$scope.focusId = -1;

	$scope.focusCarte = function(index){
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
			$scope.focusId = -1;
		}
		else {
			$scope.focusIndex = index;
			$scope.focusId = $scope.jeu.horsPioche[index].id;
		}	
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.horsPioche[index].id],
    		position: -1
    	}).success(function(){
    		var carte = $scope.jeu.horsPioche[index];
    		carte.statut = {};
			$scope.jeu.horsPioche.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	});
	}

	$scope.ouvrirCarte = function(index){
		var carte = $scope.jeu.horsPioche[index];
		carte.statut.ouverte = true;
		Cartes.changementStatut({
    		carteId: $scope.jeu.horsPioche[index].id,
    		statut: carte.statut
    	}).success(function(){
			$timeout(function(){
				$scope.jeu.ouvertes.push(carte);
			},250);
			$scope.jeu.horsPioche.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
	}

	$scope.utiliserCarteHorsPioche = function(index){
		console.log($scope.jeu.horsPioche[index]);
		if ($scope.jeu.horsPioche[index].utilisation.indexOf('reaction') >= 0){
			$scope.$emit('cartes-utilisation',{carte: $scope.jeu.horsPioche[index]});
		}
		$scope.focusIndex = -2;
	}

}]);