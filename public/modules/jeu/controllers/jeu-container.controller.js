'use strict';

angular.module('jeu').controller('JeuContainerController', ['$scope',
	function($scope) {

	$scope.actionsDisponibles = {
		action: true,
		nextAction: true
	}

}]);