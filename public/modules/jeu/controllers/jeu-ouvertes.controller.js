'use strict';

angular.module('jeu').controller('JeuOuvertesController', ['$scope','Cartes',
	function($scope,Cartes) {

	$scope.focusIndex = -2;
	$scope.focusId = -1;

	$scope.focusCarte = function(code){
		var index = -1;
		for (var i = 0;i < $scope.jeu.ouvertes.length;i ++){
			if ($scope.jeu.ouvertes[i].code === code){
				index = i;
			}
		}
		if (index == $scope.focusIndex){
			$scope.focusIndex = -2;
			$scope.focusId = -1;
		}
		else {
			$scope.focusIndex = index;
			$scope.focusId = $scope.jeu.ouvertes[index].id;
		}	
	}

	$scope.jeterCarte = function(index){
		var newPosition = -2;
		if ($scope.jeu.ouvertes[index].pile === 'horsPioche'){
			console.log("jeter un objet hors pioche ouvert");
			newPosition = -1;
		}
		Cartes.moveCartes({
    		carteIds: [$scope.jeu.ouvertes[index].id],
    		position: newPosition
    	}).success(function(){
    		var carte = $scope.jeu.ouvertes[index];
    		carte.main = {};
			$scope.defausses.pioche.push(carte);
			$scope.jeu.ouvertes.splice(index,1);
			$scope.focusIndex = newPosition;
    	}).error(function(){

    	})
    }
    
}]);