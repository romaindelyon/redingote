'use strict';

// Setting up route
angular.module('accueil').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise(function($injector, $location){
			var state = $injector.get('$state');
   			state.go('accueil');
	   		return $location.path();
		});

		// Home state routing
		$stateProvider.
		state('accueil', {
			url: '/',
			templateUrl: 'modules/accueil/views/accueil.view.html'
		});
	}
]);