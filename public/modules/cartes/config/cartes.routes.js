'use strict';

// Setting up route
angular.module('cartes').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('cartes', {
		url: '/cartes',
		templateUrl: 'modules/cartes/views/cartes.view.html'
	});

}]);