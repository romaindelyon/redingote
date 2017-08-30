'use strict';

angular.module('joueurs').controller('JoueursRecapController', ['$scope','$rootScope',
	function($scope,$rootScope) {

	$scope.createArrayFromNumber = function(num) {
		if (num != undefined){
			return new Array(num); 
		}
    	else {
    		return([]);
    	}
	}

	$scope.humeurMontree = false;
	$scope.humeurIndex = 0;

	$scope.montrerHumeur = function(){
		$scope.humeurMontree = true;
	}
	$scope.cacherHumeur = function(){
		$scope.humeurMontree = false;
	}
	$scope.updateHumeurIndex = function(){
		$scope.humeurIndex = ($scope.humeurIndex + 1)%$scope.joueurs[$scope.joueurJeuIndex].humeurs.length;
	}

}]);