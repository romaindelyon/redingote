'use strict';

angular.module('partie').controller('PartieTourDeJeuController', ['$scope','$rootScope','$http',
	function($scope,$rootScope,$http) {

	$scope.actions = [''];
	$scope.actions_1 = ['notification','recompense','action','pouvoir'];
	$scope.actions_2 = ['question','achat','duel','trois-familles'];

	$scope.startAction = function(action){
		$scope.tourDeJeu.actionEnCours = true;
		if (action === 'achat' || action === 'action' || action === 'question'){
			$scope.$emit('plateaux-action-case-start',{action: action});
		}
	}

}]);