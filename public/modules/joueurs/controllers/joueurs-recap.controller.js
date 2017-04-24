'use strict';

angular.module('joueurs').controller('JoueursRecapController', ['$scope',
	function($scope) {
		console.log($scope.autresJoueurs)
	$scope.joueurLeftStyle = "{'background-color': '"+$scope.joueurs[$scope.autresJoueurs[0]].backgroundColor+"'}";
	$scope.joueurRightStyle = "{'background-color': '"+$scope.joueurs[$scope.autresJoueurs[1]].backgroundColor+"'}";
}]);