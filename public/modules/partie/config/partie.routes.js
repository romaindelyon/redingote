'use strict';

// Setting up route
angular.module('partie').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('partie', {
		url: '/partie/:partie/:joueur',
		templateUrl: 'modules/partie/views/partie-general.view.html'
	});

}]);