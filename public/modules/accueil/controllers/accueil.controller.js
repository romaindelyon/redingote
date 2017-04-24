'use strict';

angular.module('accueil').controller('AccueilController', ['$scope','$state',
	function($scope,$state) {

	$scope.goToPartie = function(id){
		$state.go('partie',{joueur: id});
	}

}]);