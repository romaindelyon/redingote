'use strict';

angular.module('partie').controller('PartieTourController', ['$scope','Partie','PartieTourService',
	function($scope,Partie,PartieTourService) {

	$scope.actionsDisponibles.nextAction = true;

	$scope.tourActionNames = {
		0: 'Defense',
		1: 'Ouverture',
		2: 'Piochement',
		3: 'Déplacement',
		4: 'Action de case',
		5: 'Duel',
		6: 'Actions'
	};

	$scope.nextAction = function(){
		PartieTourService.moveTour($scope,1,0);
	}

}]);