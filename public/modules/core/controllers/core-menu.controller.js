'use strict';

angular.module('core').controller('CoreMenuController', ['$scope','$state',
	function($scope,$state) {

	$scope.goTo = function(state){
		$state.go(state);
	}

	$scope.goToAuthenticated = function(state){
		$state.go(state,{partie: $scope.partieId,joueur: $scope.joueurId});
	}

}]);