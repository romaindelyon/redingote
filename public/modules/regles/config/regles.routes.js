'use strict';

// Setting up route
angular.module('regles').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('regles', {
		url: '/regles',
		templateUrl: 'modules/regles/views/regles.view.html'
	});

}]);