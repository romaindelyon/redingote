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

}]);