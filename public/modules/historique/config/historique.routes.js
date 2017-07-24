'use strict';

// Setting up route
angular.module('historique').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('historique', {
		url: '/historique',
		templateUrl: 'modules/historique/views/historique.view.html'
	});

}]);