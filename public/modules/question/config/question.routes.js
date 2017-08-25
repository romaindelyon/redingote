'use strict';

// Setting up route
angular.module('historique').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
	// Home state routing
	$stateProvider.
	state('questions', {
		url: '/questions',
		templateUrl: 'modules/question/views/questions.view.html'
	});

}]);