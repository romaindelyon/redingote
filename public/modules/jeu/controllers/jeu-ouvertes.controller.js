'use strict';

angular.module('jeu').controller('JeuOuvertesController', ['$scope','Cartes',
	function($scope,Cartes) {

	$scope.focusIndex = -2;

	$scope.focusCarte = function(index){
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
		}
		else {
			$scope.focusIndex = index;
		}	
	}

	$scope.jeterCarte = function(index){
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.ouvertes[index].id],
    		position: -2
    	}).success(function(){
    		var carte = $scope.jeu.ouvertes[index];
    		carte.main = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.ouvertes.splice(index,1);
			$scope.focusIndex = -2;
    	}).error(function(){

    	})
    }

}]);