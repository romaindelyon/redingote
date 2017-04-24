'use strict';

angular.module('joueurs').controller('JoueursRecapController', ['$scope',
	function($scope) {
		console.log($scope.autresJoueurs)
	$scope.joueurLeftStyle = "{'background-color': '"+$scope.joueurs[$scope.joueurLeft].backgroundColor+"'}";
	$scope.joueurRightStyle = "{'background-color': '"+$scope.joueurs[$scope.joueurRight].backgroundColor+"'}";
}]);